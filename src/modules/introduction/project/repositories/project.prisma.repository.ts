
import { Injectable } from '@nestjs/common';
import { Project, Prisma } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { PrismaRepository } from '@/common/core/repositories';
import { IProjectRepository, ProjectFilter } from './project.repository.interface';

@Injectable()
export class ProjectPrismaRepository extends PrismaRepository<
    Project,
    Prisma.ProjectWhereInput,
    Prisma.ProjectCreateInput,
    Prisma.ProjectUpdateInput,
    Prisma.ProjectOrderByWithRelationInput
> implements IProjectRepository {
    constructor(private readonly prisma: PrismaService) {
        super(prisma.project as unknown as any, 'sort_order:asc');
    }

    protected buildWhere(filter: ProjectFilter): Prisma.ProjectWhereInput {
        const where: Prisma.ProjectWhereInput = {};

        if (filter.search) {
            where.OR = [
                { name: { contains: filter.search } },
                { slug: { contains: filter.search } },
            ];
        }

        if (filter.status) {
            where.status = filter.status as any;
        }

        if (filter.isFeatured !== undefined) {
            where.featured = filter.isFeatured;
        }

        where.deleted_at = null;

        return where;
    }

    async findBySlug(slug: string): Promise<Project | null> {
        return this.prisma.project.findFirst({
            where: { slug, deleted_at: null },
        });
    }

    async incrementViewCount(id: number): Promise<Project> {
        return this.prisma.project.update({
            where: { id: BigInt(id) },
            data: { view_count: { increment: 1 } },
        });
    }
}
