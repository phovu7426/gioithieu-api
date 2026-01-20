import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IProjectRepository, PROJECT_REPOSITORY, ProjectFilter } from '@/modules/introduction/project/repositories/project.repository.interface';
import { StringUtil } from '@/core/utils/string.util';

@Injectable()
export class ProjectService {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepo: IProjectRepository,
  ) { }

  async getList(query: any) {
    const filter: ProjectFilter = {};
    if (query.search) filter.search = query.search;
    if (query.status) filter.status = query.status;
    if (query.isFeatured !== undefined) filter.isFeatured = query.isFeatured;

    const result = await this.projectRepo.findAll({
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
    const project = await this.projectRepo.findById(id);
    return this.transform(project);
  }

  async create(data: any) {
    const payload = { ...data };
    await this.ensureSlug(payload);
    const project = await this.projectRepo.create(payload);
    return this.getOne(Number(project.id));
  }

  async update(id: number, data: any) {
    const payload = { ...data };
    const current = await this.projectRepo.findById(id);
    if (!current) throw new NotFoundException('Project not found');

    await this.ensureSlug(payload, id, (current as any).slug);
    await this.projectRepo.update(id, payload);
    return this.getOne(id);
  }

  async delete(id: number) {
    return this.projectRepo.delete(id);
  }

  async changeStatus(id: number, status: string) {
    return this.update(id, { status: status as any });
  }

  async updateSortOrder(id: number, sortOrder: number) {
    return this.update(id, { sort_order: sortOrder });
  }

  async toggleFeatured(id: number, featured: boolean) {
    return this.update(id, { featured });
  }

  async incrementViewCount(id: number) {
    return this.projectRepo.incrementViewCount(id);
  }

  private async ensureSlug(data: any, excludeId?: number, currentSlug?: string) {
    if (data.name && !data.slug) {
      data.slug = StringUtil.toSlug(data.name);
    } else if (data.slug) {
      data.slug = StringUtil.toSlug(data.slug);
    } else {
      return;
    }

    const normalizedSlug = data.slug;
    if (currentSlug && normalizedSlug === currentSlug) {
      delete data.slug;
      return;
    }

    const exists = await this.projectRepo.findBySlug(normalizedSlug);
    if (exists && (!excludeId || Number(exists.id) !== excludeId)) {
      let counter = 1;
      let uniqueSlug = `${normalizedSlug}-${counter}`;
      while (await this.projectRepo.findBySlug(uniqueSlug)) {
        counter++;
        uniqueSlug = `${normalizedSlug}-${counter}`;
      }
      data.slug = uniqueSlug;
    }
  }

  private transform(project: any) {
    if (!project) return project;
    const item = { ...project };
    if (item.id) item.id = Number(item.id);
    if (item.view_count) item.view_count = Number(item.view_count);
    if (item.created_user_id) item.created_user_id = Number(item.created_user_id);
    if (item.updated_user_id) item.updated_user_id = Number(item.updated_user_id);
    return item;
  }
}

