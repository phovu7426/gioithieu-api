import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { ProjectStatus } from '@/shared/enums/types/project-status.enum';
import { PrismaListService, PrismaListBag } from '@/common/base/services/prisma/prisma-list.service';


type PublicProjectBag = PrismaListBag & {
  Model: Project;
  Where: Prisma.ProjectWhereInput;
  Select: Prisma.ProjectSelect;
  Include: Prisma.ProjectInclude;
  OrderBy: Prisma.ProjectOrderByWithRelationInput;
};

@Injectable()
export class PublicProjectService extends PrismaListService<PublicProjectBag> {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    super(prisma.project, ['id', 'created_at', 'sort_order'], 'id:DESC');
  }

  /**
   * Override prepareFilters để chỉ lấy projects có status completed hoặc in_progress
   */
  protected override async prepareFilters(
    filters?: Prisma.ProjectWhereInput,
  ): Promise<Prisma.ProjectWhereInput | true | undefined> {
    const prepared: Prisma.ProjectWhereInput = {
      ...(filters || {}),
      status: {
        in: [ProjectStatus.completed, ProjectStatus.in_progress] as any,
      },
      deleted_at: null,
    };

    return prepared;
  }

  /**
   * Override prepareOptions để set default sort
   */
  protected override prepareOptions(queryOptions: any = {}) {
    const base = super.prepareOptions(queryOptions);

    const orderBy: Prisma.ProjectOrderByWithRelationInput[] = queryOptions?.orderBy ?? [
      { sort_order: 'asc' },
      { created_at: 'desc' },
    ];

    return {
      ...base,
      orderBy,
    };
  }

  /**
   * Get project by slug
   */
  async findBySlug(slug: string): Promise<Project | null> {
    const project = await this.prisma.project.findFirst({
      where: {
        slug,
        status: {
          in: [ProjectStatus.completed, ProjectStatus.in_progress] as any,
        },
        deleted_at: null,
      },
    });

    if (!project) {
      return null;
    }

    // Increment view count
    await this.prisma.project.update({
      where: { id: project.id },
      data: { view_count: { increment: 1 } },
    });

    // Convert BigInt fields to plain numbers/strings to avoid JSON stringify errors
    return project;
  }

  /**
   * Get featured projects
   */
  async getFeatured(limit: number = 10): Promise<Project[]> {
    const result = await this.getList(
      {
        featured: true,
        status: {
          in: [ProjectStatus.completed, ProjectStatus.in_progress] as any,
        },
      } as any,
      { limit, page: 1 },
    );

    return result.data;
  }
}

