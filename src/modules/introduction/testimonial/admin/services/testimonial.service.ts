import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ITestimonialRepository, TESTIMONIAL_REPOSITORY, TestimonialFilter } from '@/modules/introduction/testimonial/repositories/testimonial.repository.interface';
import { IProjectRepository, PROJECT_REPOSITORY } from '@/modules/introduction/project/repositories/project.repository.interface';

@Injectable()
export class TestimonialService {
  constructor(
    @Inject(TESTIMONIAL_REPOSITORY)
    private readonly testimonialRepo: ITestimonialRepository,
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepo: IProjectRepository,
  ) { }

  async getList(query: any) {
    const filter: TestimonialFilter = {};
    if (query.search) filter.search = query.search;
    if (query.status) filter.status = query.status;
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

  async getSimpleList(query: any) {
    return this.getList({
      ...query,
      limit: query.limit ?? 50,
    });
  }

  async getOne(id: number) {
    const testimonial = await this.testimonialRepo.findById(id);
    return this.transform(testimonial);
  }

  async create(data: any) {
    const payload = { ...data };
    if (payload.project_id) {
      const project = await this.projectRepo.findById(payload.project_id);
      if (!project) throw new NotFoundException(`Project with ID ${payload.project_id} not found`);
    }
    const testimonial = await this.testimonialRepo.create(payload);
    return this.getOne(Number(testimonial.id));
  }

  async update(id: number, data: any) {
    const payload = { ...data };
    if (payload.project_id) {
      const project = await this.projectRepo.findById(payload.project_id);
      if (!project) throw new NotFoundException(`Project with ID ${payload.project_id} not found`);
    }
    await this.testimonialRepo.update(id, payload);
    return this.getOne(id);
  }

  async delete(id: number) {
    return this.testimonialRepo.delete(id);
  }

  async toggleFeatured(id: number, featured: boolean) {
    return this.update(id, { featured });
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

