import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Inject } from '@nestjs/common';
import { IGroupRepository, GROUP_REPOSITORY, GroupFilter } from '@/modules/core/context/repositories/group.repository.interface';
import { IContextRepository, CONTEXT_REPOSITORY } from '@/modules/core/context/repositories/context.repository.interface';
import { RbacService } from '@/modules/core/rbac/services/rbac.service';
import { IUserGroupRepository, USER_GROUP_REPOSITORY } from '@/modules/core/rbac/repositories/user-group.repository.interface';
import { IRoleRepository, ROLE_REPOSITORY } from '@/modules/core/iam/repositories/role.repository.interface';

@Injectable()
export class AdminGroupService {
  constructor(
    @Inject(GROUP_REPOSITORY)
    private readonly groupRepo: IGroupRepository,
    @Inject(CONTEXT_REPOSITORY)
    private readonly contextRepo: IContextRepository,
    @Inject(USER_GROUP_REPOSITORY)
    private readonly userGroupRepo: IUserGroupRepository,
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepo: IRoleRepository,
    private readonly rbacService: RbacService,
  ) { }

  async getList(query: any) {
    const filter: GroupFilter = {};
    if (query.search) filter.search = query.search;
    if (query.type) filter.type = query.type;
    if (query.status) filter.status = query.status;
    if (query.contextId) filter.contextId = query.contextId;

    const result = await this.groupRepo.findAll({
      page: query.page,
      limit: query.limit,
      sort: query.sort || 'id:desc',
      filter,
    });

    result.data = result.data.map(item => this.transform(item));
    return result;
  }

  async isSystemAdmin(userId: number): Promise<boolean> {
    return this.rbacService.userHasPermissionsInGroup(userId, null, [
      'system.manage',
      'group.manage',
    ]);
  }

  async createGroup(data: any, requesterUserId: number) {
    const isAdmin = await this.isSystemAdmin(requesterUserId);
    if (!isAdmin) {
      throw new ForbiddenException('Only system admin can create groups');
    }

    const context = await this.contextRepo.findById(data.context_id);
    if (!context || (context as any).status !== 'active') {
      throw new NotFoundException(`Context with id ${data.context_id} not found`);
    }

    const existing = await this.groupRepo.findByCode(data.code);
    if (existing) {
      throw new BadRequestException(`Group with code "${data.code}" already exists`);
    }

    const payload = {
      ...data,
      context_id: BigInt(data.context_id),
      owner_id: data.owner_id ? BigInt(data.owner_id) : null,
      status: data.status || 'active',
    };

    const group = await this.groupRepo.create(payload);

    if (group.owner_id) {
      const existingUserGroup = await this.userGroupRepo.findUnique(Number(group.owner_id), Number(group.id));

      if (!existingUserGroup) {
        await this.userGroupRepo.create({
          user_id: group.owner_id,
          group_id: group.id,
        });
      }

      const ownerRole = await this.roleRepo.findOne({
        where: { code: 'admin' },
      });
      if (ownerRole) {
        await this.rbacService.assignRoleToUser(Number(group.owner_id), Number(ownerRole.id), Number(group.id));
      }
    }

    return this.transform(group);
  }

  async findById(id: number) {
    const group = await this.groupRepo.findById(id);
    return this.transform(group);
  }

  async findByCode(code: string) {
    const group = await this.groupRepo.findByCode(code);
    return this.transform(group);
  }

  async updateGroup(id: number, data: any) {
    const group = await this.groupRepo.findById(id);
    if (!group) throw new NotFoundException('Group not found');

    await this.groupRepo.update(id, data);
    return this.findById(id);
  }

  async deleteGroup(id: number) {
    const group = await this.groupRepo.findById(id);
    if (!group) throw new NotFoundException('Group not found');

    return this.groupRepo.delete(id);
  }

  private transform(group: any) {
    if (!group) return group;
    const item = { ...group };
    if (item.id) item.id = Number(item.id);
    if (item.owner_id) item.owner_id = Number(item.owner_id);
    if (item.context_id) item.context_id = Number(item.context_id);
    if (item.context) {
      item.context = {
        ...item.context,
        id: Number(item.context.id),
        ref_id: item.context.ref_id ? Number(item.context.ref_id) : null,
      };
    }
    return item;
  }
}

