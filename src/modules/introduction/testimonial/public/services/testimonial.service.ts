import { Injectable, Inject } from '@nestjs/common';
import { ITestimonialRepository, TESTIMONIAL_REPOSITORY, TestimonialFilter } from '@/modules/introduction/testimonial/repositories/testimonial.repository.interface';
import { BasicStatus } from '@/shared/enums/types/basic-status.enum';

@Injectable()
export class PublicTestimonialService {
  constructor(
    @Inject(TESTIMONIAL_REPOSITORY)
    private readonly testimonialRepo: ITestimonialRepository,
  ) { }

  async getList(query: any) {
    const filter: TestimonialFilter = {
      status: BasicStatus.active
    };
    if (query.search) filter.search = query.search;
    if (query.projectId) filter.projectId = query.projectId;

    const result = await this.testimonialRepo.findAll({
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      filter,
    });

    result.data = result.data.map(item => this.transform(item));
    return result;
  }

  async getFeatured(limit: number = 10) {
    const result = await this.getList({ featured: true, limit, page: 1 } as any);
    return result.data;
  }

  async findByProject(projectId: number) {
    const result = await this.getList({ projectId, limit: 100, page: 1 } as any);
    return result.data;
  }

  private transform(testimonial: any) {
    if (!testimonial) return testimonial;
    const item = { ...testimonial };
    if (item.id) item.id = Number(item.id);
    if (item.project_id) item.project_id = Number(item.project_id);
    if (item.project) {
      item.project = {
        id: Number(item.project.id),
        name: item.project.name,
        slug: item.project.slug,
      };
    }
    return item;
  }
}

