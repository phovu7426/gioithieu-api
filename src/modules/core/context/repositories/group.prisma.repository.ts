
import { Injectable } from '@nestjs/common';
import { Group, Prisma } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { PrismaRepository } from '@/common/core/repositories';
import { IGroupRepository, GroupFilter } from './group.repository.interface';

@Injectable()
export class GroupPrismaRepository extends PrismaRepository<
    Group,
    Prisma.GroupWhereInput,
    Prisma.GroupCreateInput,
    Prisma.GroupUpdateInput,
    Prisma.GroupOrderByWithRelationInput
> implements IGroupRepository {
    constructor(private readonly prisma: PrismaService) {
        super(prisma.group as unknown as any, 'id:desc');
    }

    protected buildWhere(filter: GroupFilter): Prisma.GroupWhereInput {
        const where: Prisma.GroupWhereInput = {};

        if (filter.search) {
            where.OR = [
                { name: { contains: filter.search } },
                { code: { contains: filter.search } },
            ];
        }

        if (filter.type) {
            where.type = filter.type;
        }

        if (filter.status) {
            where.status = filter.status;
        }

        if (filter.contextId) {
            where.context_id = BigInt(filter.contextId);
        }

        if (filter.ownerId) {
            where.owner_id = BigInt(filter.ownerId);
        }

        where.deleted_at = null;

        return where;
    }

    async findByCode(code: string): Promise<Group | null> {
        return this.prisma.group.findFirst({
            where: { code, deleted_at: null },
            include: { context: true },
        }) as any;
    }

    override async findById(id: number): Promise<Group | null> {
        return this.prisma.group.findFirst({
            where: { id: BigInt(id), deleted_at: null },
            include: { context: true },
        }) as any;
    }
}
