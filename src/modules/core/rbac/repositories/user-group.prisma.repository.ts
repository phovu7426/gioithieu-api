import { Injectable } from '@nestjs/common';
import { UserGroup, Prisma } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { PrismaRepository } from '@/common/core/repositories';
import { IUserGroupRepository } from './user-group.repository.interface';

@Injectable()
export class UserGroupPrismaRepository extends PrismaRepository<
    UserGroup,
    Prisma.UserGroupWhereInput,
    Prisma.UserGroupCreateInput,
    Prisma.UserGroupUpdateInput,
    Prisma.UserGroupOrderByWithRelationInput
> implements IUserGroupRepository {
    constructor(private readonly prisma: PrismaService) {
        super(prisma.userGroup as unknown as any);
    }

    async findUnique(userId: number | bigint, groupId: number | bigint): Promise<UserGroup | null> {
        return this.prisma.userGroup.findUnique({
            where: {
                user_id_group_id: {
                    user_id: typeof userId === 'bigint' ? userId : BigInt(userId),
                    group_id: typeof groupId === 'bigint' ? groupId : BigInt(groupId),
                },
            },
        });
    }

    protected buildWhere(filter: any): Prisma.UserGroupWhereInput {
        const where: Prisma.UserGroupWhereInput = {};
        if (filter.user_id) where.user_id = BigInt(filter.user_id);
        if (filter.group_id) where.group_id = BigInt(filter.group_id);
        return where;
    }
}
