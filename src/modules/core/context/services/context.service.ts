import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { IContextRepository, CONTEXT_REPOSITORY } from '@/modules/core/context/repositories/context.repository.interface';
import { IGroupRepository, GROUP_REPOSITORY } from '@/modules/core/context/repositories/group.repository.interface';
import { Request } from 'express';
import { RbacService } from '@/modules/core/rbac/services/rbac.service';
import { IUserGroupRepository, USER_GROUP_REPOSITORY } from '@/modules/core/rbac/repositories/user-group.repository.interface';
import { BaseService } from '@/common/core/services';

@Injectable()
export class ContextService extends BaseService<any, IContextRepository> {
  constructor(
    @Inject(CONTEXT_REPOSITORY)
    private readonly contextRepo: IContextRepository,
    @Inject(GROUP_REPOSITORY)
    private readonly groupRepo: IGroupRepository,
    @Inject(forwardRef(() => RbacService))
    private readonly rbacService: RbacService,
    @Inject(USER_GROUP_REPOSITORY)
    private readonly userGroupRepo: IUserGroupRepository,
  ) {
    super(contextRepo);
  }

  private async isSystemAdmin(userId: number): Promise<boolean> {
    return this.rbacService.userHasPermissionsInGroup(userId, null, [
      'system.manage',
      'group.manage',
    ]);
  }

  async resolveContext(req: Request) {
    const contextId = req.headers['x-context-id'] || (req.query as any).context_id;

    if (!contextId) {
      throw new NotFoundException('Context ID is required in header (X-Context-Id) or query (?context_id)');
    }

    const context = await this.contextRepo.findOne({
      id: contextId,
      status: 'active'
    });

    if (!context) {
      throw new NotFoundException('Context not found');
    }

    return this.transform(context);
  }

  async getUserContexts(userId: number) {
    const userGroups = await this.userGroupRepo.findMany({
      where: { user_id: BigInt(userId) },
    });

    if (!userGroups.length) return [];

    const groupIds = Array.from(new Set(userGroups.map((ug) => ug.group_id)));

    const groups = await this.groupRepo.findManyRaw({
      where: {
        id: { in: groupIds.map(id => BigInt(id)) },
        status: 'active' as any,
      }
    });

    const contextIds = Array.from(new Set(groups.map((g) => g.context_id)));
    if (!contextIds.length) return [];

    const contexts = await this.contextRepo.findManyRaw({
      where: {
        id: { in: contextIds },
        status: 'active' as any,
      }
    });

    return contexts.map(ctx => this.transform(ctx));
  }

  async getUserContextsForTransfer(userId: number) {
    const systemContext = await this.contextRepo.findOne({
      id: 1,
      status: 'active'
    });

    const userContexts = await this.getUserContexts(userId);

    const allContexts: any[] = [];
    if (systemContext) {
      allContexts.push(this.transform(systemContext));
    }
    allContexts.push(...userContexts);

    const uniqueContexts = allContexts.filter(
      (ctx, index, self) => index === self.findIndex((c) => Number(c.id) === Number(ctx.id)),
    );

    return uniqueContexts;
  }

  async createSystemContext() {
    const exists = await this.contextRepo.findOne({
      type: 'system',
      ref_id: null
    });

    if (exists) return this.transform(exists);

    const context = await this.contextRepo.create({
      type: 'system',
      ref_id: null,
      name: 'System',
      code: 'system',
      status: 'active' as any,
    });

    return this.transform(context);
  }

  async findByTypeAndRefId(type: string, refId: number | null) {
    const context = await this.contextRepo.findByTypeAndRefId(type, refId);
    return this.transform(context);
  }

  async createContext(data: any, requesterUserId: number) {
    const isAdmin = await this.isSystemAdmin(requesterUserId);
    if (!isAdmin) {
      throw new ForbiddenException('Only system admin can create contexts');
    }
    return this.create(data);
  }

  protected async beforeCreate(data: any) {
    const existing = await this.contextRepo.findByTypeAndRefId(data.type, data.ref_id ?? null);
    if (existing) {
      throw new BadRequestException(`Context with type "${data.type}" and ref_id "${data.ref_id ?? 'null'}" already exists`);
    }

    const code = data.code || `${data.type}-${data.ref_id ?? 'system'}`;
    const existingByCode = await this.contextRepo.findByCode(code);
    if (existingByCode) {
      throw new BadRequestException(`Context with code "${code}" already exists`);
    }

    const payload = {
      ...data,
      ref_id: data.ref_id ? BigInt(data.ref_id) : null,
      code,
      status: data.status || 'active',
    };
    return payload;
  }

  async updateContext(id: number, data: any, requesterUserId: number) {
    const isAdmin = await this.isSystemAdmin(requesterUserId);
    if (!isAdmin) {
      throw new ForbiddenException('Only system admin can update contexts');
    }
    return this.update(id, data);
  }

  protected async beforeUpdate(id: number | bigint, data: any) {
    if (Number(id) === 1) {
      throw new BadRequestException('Cannot update system context');
    }

    const current = await this.contextRepo.findById(id);
    if (!current) throw new NotFoundException('Context not found');

    if (data.code && data.code !== current.code) {
      const existing = await this.contextRepo.findByCode(data.code);
      if (existing) {
        throw new BadRequestException(`Context with code "${data.code}" already exists`);
      }
    }

    if (data.ref_id !== undefined) {
      data.ref_id = data.ref_id ? BigInt(data.ref_id) : null;
    }

    return data;
  }

  async deleteContext(id: number) {
    return this.delete(id);
  }

  protected async beforeDelete(id: number | bigint): Promise<boolean> {
    if (Number(id) === 1) {
      throw new BadRequestException('Cannot delete system context');
    }

    const groupsCount = await this.groupRepo.count({
      context_id: BigInt(id),
      deleted_at: null,
    });

    if (groupsCount > 0) {
      throw new BadRequestException(`Cannot delete context: ${groupsCount} group(s) are using this context`);
    }

    return true;
  }
}

