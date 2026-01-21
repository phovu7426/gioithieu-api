import { Injectable, Inject } from '@nestjs/common';
import { IPostTagRepository, POST_TAG_REPOSITORY, PostTagFilter } from '@/modules/post/repositories/post-tag.repository.interface';

@Injectable()
export class PostTagService {
  constructor(
    @Inject(POST_TAG_REPOSITORY)
    private readonly tagRepo: IPostTagRepository,
  ) { }

  async getList(query: any) {
    const filter: PostTagFilter = {
      status: 'active' as any,
    };
    if (query.search) filter.search = query.search;

    const result = await this.tagRepo.findAll({
      page: query.page,
      limit: query.limit,
      sort: query.sort || 'created_at:DESC',
      filter,
    });

    result.data = result.data.map((item) => this.transform(item));
    return result;
  }

  async findBySlug(slug: string) {
    const tag = await this.tagRepo.findBySlug(slug);
    if (!tag || (tag as any).status !== 'active') return null;
    return this.transform(tag);
  }

  async getOne(id: number) {
    const tag = await this.tagRepo.findById(id);
    return this.transform(tag);
  }

  private transform(tag: any) {
    if (!tag) return tag;
    const item = { ...tag };
    if (item.id) item.id = Number(item.id);
    return item;
  }
}

