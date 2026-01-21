import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { RbacCacheService } from '@/modules/core/rbac/services/rbac-cache.service';
import { RequestContext } from '@/common/utils/request-context.util';
import { IRoleRepository, ROLE_REPOSITORY, RoleFilter } from '@/modules/core/iam/repositories/role.repository.interface';
import { IPermissionRepository, PERMISSION_REPOSITORY } from '@/modules/core/iam/repositories/permission.repository.interface';
import { IUserRoleAssignmentRepository, USER_ROLE_ASSIGNMENT_REPOSITORY } from '@/modules/core/rbac/repositories/user-role-assignment.repository.interface';

@Injectable()
export class RoleService {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepo: IRoleRepository,
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepo: IPermissionRepository,
    @Inject(USER_ROLE_ASSIGNMENT_REPOSITORY)
    private readonly assignmentRepo: IUserRoleAssignmentRepository,
    private readonly rbacCache: RbacCacheService,
  ) { }

  async getList(query: any) {
    const filter: RoleFilter & { contextId?: number } = {};
    if (query.search) filter.search = query.search;
    if (query.status) filter.status = query.status;
    if (query.parentId !== undefined) filter.parentId = query.parentId;

    const context = RequestContext.get<any>('context');
    const contextId = RequestContext.get<number>('contextId') || 1;

    if (context && context.type !== 'system') {
      filter.contextId = contextId;
    }

    const result = await this.roleRepo.findAll({
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      filter,
    });

    result.data = result.data.map((role) => this.transformRole(role));
    return result;
  }

  async getSimpleList(query: any) {
    return this.getList({ ...query, limit: 1000 });
  }

  async getOne(id: number) {
    const role = await this.roleRepo.findById(id);
    return this.transformRole(role);
  }

  async create(data: any, createdBy?: number) {
    const payload = { ...data };

    // Audit
    if (createdBy) {
      payload.created_user_id = BigInt(createdBy);
      payload.updated_user_id = BigInt(createdBy);
    }

    // Unique code check
    if (payload.code) {
      const exists = await this.roleRepo.findByCode(payload.code);
      if (exists) throw new BadRequestException('Role code already exists');
    }

    const contextIds = this.normalizeIdArray(payload.context_ids);
    delete payload.context_ids;

    const role = await this.roleRepo.create(payload);

    if (contextIds) {
      await this.roleRepo.syncContexts(role.id, contextIds);
    }

    return this.getOne(Number(role.id));
  }

  async createWithAudit(data: any, createdBy?: number) {
    return this.create(data, createdBy);
  }

  async update(id: number, data: any, updatedBy?: number) {
    const payload = { ...data };
    if (updatedBy) payload.updated_user_id = BigInt(updatedBy);

    const current = await this.roleRepo.findById(id);
    if (!current) throw new NotFoundException('Role not found');

    if (payload.code && payload.code !== current.code) {
      const exists = await this.roleRepo.findByCode(payload.code);
      if (exists) throw new BadRequestException('Role code already exists');
    }

    const contextIds = this.normalizeIdArray(payload.context_ids);
    delete payload.context_ids;

    await this.roleRepo.update(id, payload);

    if (contextIds !== null) {
      await this.roleRepo.syncContexts(id, contextIds);
    }

    return this.getOne(id);
  }

  async updateWithAudit(id: number, data: any, updatedBy?: number) {
    return this.update(id, data, updatedBy);
  }

  async updateById(id: number, data: any) { return this.update(id, data); }

  async delete(id: number) {
    // Constraint checks
    const childrenCount = await this.roleRepo.count({ parent_id: BigInt(id), deleted_at: null });
    if (childrenCount > 0) throw new BadRequestException('Cannot delete role with children');

    const userCount = await this.assignmentRepo.count({ role_id: BigInt(id) });
    if (userCount > 0) throw new BadRequestException('Cannot delete role assigned to users');

    return this.roleRepo.delete(id);
  }

  async deleteById(id: number) { return this.delete(id); }

  async assignPermissions(roleId: number, permissionIds: number[]) {
    const role = await this.roleRepo.findById(roleId);
    if (!role) throw new NotFoundException('Role not found');

    await this.roleRepo.syncPermissions(roleId, permissionIds);

    if (this.rbacCache && typeof this.rbacCache.bumpVersion === 'function') {
      await this.rbacCache.bumpVersion().catch(() => undefined);
    }

    return this.getOne(roleId);
  }

  private normalizeIdArray(input: any): number[] | null {
    if (input === undefined) return null;
    if (!Array.isArray(input)) return [];
    return input.map((id: any) => Number(id)).filter((id) => !Number.isNaN(id));
  }

  private transformRole(role: any) {
    if (!role) return role;
    const item = { ...role };

    if (item.parent) {
      const { id, code, name, status } = item.parent;
      item.parent = { id, code, name, status };
    }

    if (item.children) {
      item.children = item.children.map((child: any) => {
        const { id, code, name, status } = child;
        return { id, code, name, status };
      });
    }

    if (item.permissions) {
      item.permissions = (item.permissions as any[])
        .map((link) => link.permission)
        .filter(Boolean)
        .map((perm: any) => {
          const { id, code, name, status } = perm;
          return { id, code, name, status };
        });
    }

    if (item.role_contexts) {
      const contextId = RequestContext.get<number>('contextId') || 1;
      const context = RequestContext.get<any>('context');
      let filtered = item.role_contexts as any[];
      if (context && context.type !== 'system') {
        filtered = filtered.filter((rc) => Number(rc.context_id) === contextId);
      }

      item.context_ids = filtered.map((rc) => Number(rc.context_id));
      item.contexts = filtered
        .filter((rc) => rc.context)
        .map((rc) => {
          const ctx = rc.context;
          return {
            id: Number(ctx.id),
            type: ctx.type,
            name: ctx.name,
            status: ctx.status,
            ref_id: ctx.ref_id ? Number(ctx.ref_id) : null,
          };
        });
      delete item.role_contexts;
    } else {
      item.context_ids = [];
      item.contexts = [];
    }

    return item;
  }
}
