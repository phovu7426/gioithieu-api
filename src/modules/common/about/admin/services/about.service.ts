import { Injectable, Inject } from '@nestjs/common';
import { IAboutRepository, ABOUT_REPOSITORY, AboutFilter } from '@/modules/common/about/repositories/about.repository.interface';
import { StringUtil } from '@/core/utils/string.util';

@Injectable()
export class AboutService {
  constructor(
    @Inject(ABOUT_REPOSITORY)
    private readonly aboutRepo: IAboutRepository,
  ) { }

  async getList(query: any) {
    const filter: AboutFilter = {};
    if (query.search) filter.search = query.search;
    if (query.section_type) filter.section_type = query.section_type;
    if (query.status) filter.status = query.status;

    const result = await this.aboutRepo.findAll({
      page: query.page,
      limit: query.limit,
      sort: query.sort || 'sort_order:ASC,created_at:DESC',
      filter,
    });

    result.data = result.data.map((item) => this.transform(item));
    return result;
  }

  async getOne(id: number) {
    const about = await this.aboutRepo.findById(id);
    return this.transform(about);
  }

  async create(data: any) {
    await this.ensureSlug(data);
    const about = await this.aboutRepo.create(data);
    return this.getOne(Number(about.id));
  }

  async update(id: number, data: any) {
    const current = await this.aboutRepo.findById(id);
    await this.ensureSlug(data, id, current?.slug);
    await this.aboutRepo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    return this.aboutRepo.delete(id);
  }

  private async ensureSlug(data: any, excludeId?: number, currentSlug?: string): Promise<void> {
    if (data.title && !data.slug) {
      data.slug = StringUtil.toSlug(data.title);
    }

    if (data.slug) {
      const normalizedSlug = StringUtil.toSlug(data.slug);
      const normalizedCurrentSlug = currentSlug ? StringUtil.toSlug(currentSlug) : null;

      if (normalizedCurrentSlug && normalizedSlug === normalizedCurrentSlug) {
        delete data.slug;
        return;
      }

      const existing = await this.aboutRepo.findOne({
        slug: normalizedSlug,
        deleted_at: null,
        ...(excludeId ? { id: { not: BigInt(excludeId) } } : {}),
      });

      if (existing) {
        let counter = 1;
        let uniqueSlug = `${normalizedSlug}-${counter}`;
        while (await this.aboutRepo.findOne({
          slug: uniqueSlug,
          deleted_at: null,
        })) {
          counter++;
          uniqueSlug = `${normalizedSlug}-${counter}`;
        }
        data.slug = uniqueSlug;
      } else {
        data.slug = normalizedSlug;
      }
    }
  }

  private transform(about: any) {
    if (!about) return about;
    const item = { ...about };
    if (item.id) item.id = Number(item.id);
    return item;
  }
}

