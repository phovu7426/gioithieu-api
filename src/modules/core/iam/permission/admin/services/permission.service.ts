import { Injectable, BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { IPermissionRepository, PERMISSION_REPOSITORY, PermissionFilter } from '@/modules/core/iam/repositories/permission.repository.interface';
import { RbacCacheService } from '@/modules/core/rbac/services/rbac-cache.service';

@Injectable()
export class PermissionService {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepo: IPermissionRepository,
    private readonly rbacCache: RbacCacheService,
  ) { }

  async getList(query: any) {
    const filter: PermissionFilter = {};
    if (query.search) filter.search = query.search;
    if (query.status) filter.status = query.status;
    if (query.scope) filter.scope = query.scope;
    if (query.parentId !== undefined) filter.parentId = query.parentId;

    const result = await this.permissionRepo.findAll({
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      filter,
    });

    result.data = result.data.map((item) => this.transform(item));
    return result;
  }

  async getSimpleList(query: any) {
    return this.getList({ ...query, limit: 1000 });
  }

  async getOne(id: number) {
    const permission = await this.permissionRepo.findById(id);
    return this.transform(permission);
  }

  async create(data: any, createdBy?: number) {
    const payload = { ...data };
    if (createdBy) {
      payload.created_user_id = BigInt(createdBy);
      payload.updated_user_id = BigInt(createdBy);
    }

    if (payload.code) {
      const exists = await this.permissionRepo.findByCode(payload.code);
      if (exists) throw new BadRequestException('Permission code already exists');
    }

    if (payload.parent_id) {
      payload.parent_id = BigInt(payload.parent_id);
    }

    const permission = await this.permissionRepo.create(payload);
    return this.getOne(Number(permission.id));
  }

  async createWithAudit(data: any, createdBy?: number) {
    return this.create(data, createdBy);
  }

  async update(id: number, data: any, updatedBy?: number) {
    const payload = { ...data };
    if (updatedBy) payload.updated_user_id = BigInt(updatedBy);

    const current = await this.permissionRepo.findById(id);
    if (!current) throw new NotFoundException('Permission not found');

    if (payload.code && payload.code !== current.code) {
      const exists = await this.permissionRepo.findByCode(payload.code);
      if (exists) throw new BadRequestException('Permission code already exists');
    }

    if (payload.parent_id) {
      payload.parent_id = BigInt(payload.parent_id);
    }

    await this.permissionRepo.update(id, payload);

    if (this.rbacCache && typeof this.rbacCache.bumpVersion === 'function') {
      await this.rbacCache.bumpVersion().catch(() => undefined);
    }

    return this.getOne(id);
  }

  async updateWithAudit(id: number, data: any, updatedBy?: number) {
    return this.update(id, data, updatedBy);
  }

  async delete(id: number) {
    const childrenCount = await this.permissionRepo.count({ parent_id: BigInt(id), deleted_at: null });
    if (childrenCount > 0) throw new BadRequestException('Cannot delete permission with children');

    await this.permissionRepo.delete(id);

    if (this.rbacCache && typeof this.rbacCache.bumpVersion === 'function') {
      await this.rbacCache.bumpVersion().catch(() => undefined);
    }
    return true;
  }

  async deleteById(id: number) {
    return this.delete(id);
  }

  private transform(permission: any) {
    if (!permission) return permission;
    const item = { ...permission };
    if (item.parent) {
      const { id, code, name, status } = item.parent;
      item.parent = { id, code, name, status };
    }
    if (item.children) {
      item.children = (item.children as any[]).map((child) => {
        const { id, code, name, status } = child;
        return { id, code, name, status };
      });
    }
    return item;
  }
}
