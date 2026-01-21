import { Injectable, Inject } from '@nestjs/common';
import { IProjectRepository, PROJECT_REPOSITORY, ProjectFilter } from '@/modules/introduction/project/repositories/project.repository.interface';
import { ProjectStatus } from '@/shared/enums/types/project-status.enum';
import { BaseContentService } from '@/common/base/services';

@Injectable()
export class PublicProjectService extends BaseContentService<any, IProjectRepository> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepo: IProjectRepository,
  ) {
    super(projectRepo);
  }

  async getList(query: any) {
    const filter: ProjectFilter = {
      status: {
        in: [ProjectStatus.completed, ProjectStatus.in_progress] as any,
      } as any
    };
    if (query.search) filter.search = query.search;
    if (query.isFeatured !== undefined) filter.isFeatured = query.isFeatured;

    return super.getList({
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      filter,
    });
  }

  async findBySlug(slug: string) {
    const project = await this.projectRepo.findBySlug(slug);
    if (!project) return null;

    // Check status
    const allowed = [ProjectStatus.completed, ProjectStatus.in_progress];
    if (!allowed.includes((project as any).status)) return null;

    // Increment view count
    await this.incrementViewCount(Number(project.id));

    return this.transform(project);
  }

  async getFeatured(limit: number = 10) {
    const result = await this.getList({ isFeatured: true, limit, page: 1 });
    return result.data as any[];
  }

  protected transform(project: any) {
    if (!project) return project;
    const item = super.transform(project) as any;
    if (item.view_count !== undefined) item.view_count = Number(item.view_count);
    return item;
  }
}

