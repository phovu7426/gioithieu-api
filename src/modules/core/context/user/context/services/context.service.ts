import { Injectable, Inject } from '@nestjs/common';
import { IContextRepository, CONTEXT_REPOSITORY } from '@/modules/core/context/repositories/context.repository.interface';
import { IGroupRepository, GROUP_REPOSITORY } from '@/modules/core/context/repositories/group.repository.interface';
import { IUserGroupRepository, USER_GROUP_REPOSITORY } from '@/modules/core/rbac/repositories/user-group.repository.interface';

@Injectable()
export class UserContextService {
  constructor(
    @Inject(CONTEXT_REPOSITORY)
    private readonly contextRepo: IContextRepository,
    @Inject(GROUP_REPOSITORY)
    private readonly groupRepo: IGroupRepository,
    @Inject(USER_GROUP_REPOSITORY)
    private readonly userGroupRepo: IUserGroupRepository,
  ) { }

  async getUserContexts(userId: number) {
    const userGroups = await this.userGroupRepo.findMany({
      where: { user_id: BigInt(userId) },
    });

    if (!userGroups.length) return [];

    const groupIds = Array.from(new Set(userGroups.map((ug) => ug.group_id)));

    const groups = await this.groupRepo.findMany({
      where: {
        id: { in: groupIds.map(id => BigInt(id)) },
        status: 'active' as any,
      } as any,
    });

    const contextIds = Array.from(new Set(groups.map((g) => g.context_id)));
    if (!contextIds.length) return [];

    const contexts = await this.contextRepo.findMany({
      where: {
        id: { in: contextIds },
        status: 'active' as any,
      } as any,
    });

    return contexts.map(ctx => this.transform(ctx));
  }

  async getUserContextsForTransfer(userId: number) {
    const systemContext = await this.contextRepo.findFirst({
      where: {
        id: BigInt(1),
        status: 'active' as any,
      },
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

  private transform(context: any) {
    if (!context) return context;
    const item = { ...context };
    if (item.id) item.id = Number(item.id);
    if (item.ref_id) item.ref_id = Number(item.ref_id);
    return item;
  }
}

