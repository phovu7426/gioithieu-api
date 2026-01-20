
import { Injectable } from '@nestjs/common';
import { PostCategory, Prisma } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { PrismaRepository } from '@/common/base/repository/prisma.repository';
import { IPostCategoryRepository, PostCategoryFilter } from './post-category.repository.interface';

@Injectable()
export class PostCategoryPrismaRepository extends PrismaRepository<
    PostCategory,
    Prisma.PostCategoryWhereInput,
    Prisma.PostCategoryCreateInput,
    Prisma.PostCategoryUpdateInput,
    Prisma.PostCategoryOrderByWithRelationInput
> implements IPostCategoryRepository {
    constructor(private readonly prisma: PrismaService) {
        super(prisma.postCategory as unknown as any);
    }

    protected buildWhere(filter: PostCategoryFilter): Prisma.PostCategoryWhereInput {
        const where: Prisma.PostCategoryWhereInput = {};

        if (filter.search) {
            where.OR = [
                { name: { contains: filter.search } },
                { slug: { contains: filter.search } },
            ];
        }

        if (filter.status !== undefined) {
            where.status = filter.status as any;
        }

        if (filter.parentId !== undefined) {
            where.parent_id = filter.parentId === null ? null : BigInt(filter.parentId);
        }

        return where;
    }

    async findBySlug(slug: string): Promise<PostCategory | null> {
        return this.prisma.postCategory.findUnique({
            where: { slug },
        });
    }

    async findAllWithChildren(): Promise<any[]> {
        return this.prisma.postCategory.findMany({
            include: {
                children: true,
            },
            orderBy: { id: 'asc' },
        });
    }
}
