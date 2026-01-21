
import { Injectable } from '@nestjs/common';
import { Faq, Prisma } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { PrismaRepository } from '@/common/core/repositories';
import { IFaqRepository, FaqFilter } from './faq.repository.interface';

@Injectable()
export class FaqPrismaRepository extends PrismaRepository<
    Faq,
    Prisma.FaqWhereInput,
    Prisma.FaqCreateInput,
    Prisma.FaqUpdateInput,
    Prisma.FaqOrderByWithRelationInput
> implements IFaqRepository {
    constructor(private readonly prisma: PrismaService) {
        super(prisma.faq as unknown as any, 'sort_order:asc');
    }

    protected buildWhere(filter: FaqFilter): Prisma.FaqWhereInput {
        const where: Prisma.FaqWhereInput = {};

        if (filter.search) {
            where.OR = [
                { question: { contains: filter.search } },
                { answer: { contains: filter.search } },
            ];
        }

        if (filter.status) {
            where.status = filter.status as any;
        }

        where.deleted_at = null;

        return where;
    }

    async incrementViewCount(id: number): Promise<Faq> {
        return this.prisma.faq.update({
            where: { id: BigInt(id) },
            data: { view_count: { increment: 1 } },
        });
    }

    async incrementHelpfulCount(id: number): Promise<Faq> {
        return this.prisma.faq.update({
            where: { id: BigInt(id) },
            data: { helpful_count: { increment: 1 } },
        });
    }
}
