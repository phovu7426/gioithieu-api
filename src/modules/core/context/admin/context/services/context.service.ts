
import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { IContextRepository, CONTEXT_REPOSITORY, ContextFilter } from '@/modules/core/context/repositories/context.repository.interface';
import { RbacService } from '@/modules/core/rbac/services/rbac.service';
import { IGroupRepository, GROUP_REPOSITORY } from '@/modules/core/context/repositories/group.repository.interface';

@Injectable()
export class AdminContextService {
  constructor(
    @Inject(CONTEXT_REPOSITORY)
    private readonly contextRepo: IContextRepository,
    @Inject(forwardRef(() => RbacService))
    private readonly rbacService: RbacService,
    @Inject(GROUP_REPOSITORY)
    private readonly groupRepo: IGroupRepository,
  ) { }

  async getList(query: any) {
    const filter: ContextFilter = {};
    if (query.search) filter.search = query.search;
    if (query.type) filter.type = query.type;
    if (query.status) filter.status = query.status;

    const result = await this.contextRepo.findAll({
      page: query.page,
      limit: query.limit,
      sort: query.sort || 'id:desc',
      filter,
    });

    result.data = result.data.map(item => this.transform(item));
    return result;
  }

  private async isSystemAdmin(userId: number): Promise<boolean> {
    return this.rbacService.userHasPermissionsInGroup(userId, null, [
      'system.manage',
      'group.manage',
    ]);
  }

  async findById(id: number) {
    const context = await this.contextRepo.findFirst({
      where: { id: BigInt(id), status: 'active' as any }
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

    const context = await this.contextRepo.create(payload);
    return this.transform(context);
  }

  async updateContext(id: number, data: any, requesterUserId: number) {
    const isAdmin = await this.isSystemAdmin(requesterUserId);
    if (!isAdmin) {
      throw new ForbiddenException('Only system admin can update contexts');
    }

    const context = await this.contextRepo.findById(id);
    if (!context) throw new NotFoundException('Context not found');

    if (id === 1) {
      throw new BadRequestException('Cannot update system context');
    }

    if (data.code && data.code !== context.code) {
      const existing = await this.contextRepo.findByCode(data.code);
      if (existing) {
        throw new BadRequestException(`Context with code "${data.code}" already exists`);
      }
    }

    await this.contextRepo.update(id, data);
    return this.findById(id);
  }

  async deleteContext(id: number) {
    const context = await this.contextRepo.findById(id);
    if (!context) throw new NotFoundException('Context not found');

    if (id === 1) {
      throw new BadRequestException('Cannot delete system context');
    }

    // Use groupRepo instead of prisma.group.count
    const groups = await this.groupRepo.findMany({
      where: { context_id: BigInt(id), deleted_at: null },
    });

    if (groups.length > 0) {
      throw new BadRequestException(`Cannot delete context: ${groups.length} group(s) are using this context`);
    }

    return this.contextRepo.delete(id);
  }

  private transform(context: any) {
    if (!context) return context;
    const item = { ...context };
    if (item.id) item.id = Number(item.id);
    if (item.ref_id) item.ref_id = Number(item.ref_id);
    return item;
  }
}
