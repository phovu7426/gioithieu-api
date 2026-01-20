
import { Injectable } from '@nestjs/common';
import { Context, Prisma } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { PrismaRepository } from '@/common/base/repository/prisma.repository';
import { IContextRepository, ContextFilter } from './context.repository.interface';

@Injectable()
export class ContextPrismaRepository extends PrismaRepository<
    Context,
    Prisma.ContextWhereInput,
    Prisma.ContextCreateInput,
    Prisma.ContextUpdateInput,
    Prisma.ContextOrderByWithRelationInput
> implements IContextRepository {
    constructor(private readonly prisma: PrismaService) {
        super(prisma.context as unknown as any, 'id:desc');
    }

    protected buildWhere(filter: ContextFilter): Prisma.ContextWhereInput {
        const where: Prisma.ContextWhereInput = {};

        if (filter.search) {
            where.OR = [
                { name: { contains: filter.search } },
                { code: { contains: filter.search } },
            ];
        }

        if (filter.type) {
            where.type = filter.type;
        }

        if (filter.refId !== undefined) {
            where.ref_id = filter.refId === null ? null : BigInt(filter.refId);
        }

        if (filter.status) {
            where.status = filter.status;
        }

        where.deleted_at = null;

        return where;
    }

    async findByTypeAndRefId(type: string, refId: number | null): Promise<Context | null> {
        return this.prisma.context.findFirst({
            where: {
                type,
                ref_id: refId === null ? null : BigInt(refId),
                deleted_at: null,
            },
        });
    }

    async findByCode(code: string): Promise<Context | null> {
        return this.prisma.context.findFirst({
            where: { code, deleted_at: null },
        });
    }
}
