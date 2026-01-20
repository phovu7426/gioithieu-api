import { Injectable, Inject } from '@nestjs/common';
import { IAboutRepository, ABOUT_REPOSITORY, AboutFilter } from '@/modules/common/about/repositories/about.repository.interface';
import { BasicStatus } from '@/shared/enums/types/basic-status.enum';
import { AboutSectionType } from '@/shared/enums/types/about-section-type.enum';

@Injectable()
export class PublicAboutService {
  constructor(
    @Inject(ABOUT_REPOSITORY)
    private readonly aboutRepo: IAboutRepository,
  ) { }

  async getList(query: any) {
    const filter: AboutFilter = {
      status: BasicStatus.active
    };
    if (query.section_type) filter.section_type = query.section_type;

    const result = await this.aboutRepo.findAll({
      page: query.page,
      limit: query.limit,
      sort: query.sort || 'sort_order:ASC,created_at:DESC',
      filter,
    });

    result.data = result.data.map((item) => this.transform(item));
    return result;
  }

  async findBySlug(slug: string): Promise<any | null> {
    const about = await this.aboutRepo.findBySlug(slug);
    return this.transform(about);
  }

  async findByType(type: AboutSectionType): Promise<any[]> {
    const result = await this.getList({
      section_type: type,
      limit: 100,
      page: 1,
    });
    return result.data;
  }

  private transform(about: any) {
    if (!about) return about;
    const item = { ...about };
    if (item.id) item.id = Number(item.id);
    return item;
  }
}

