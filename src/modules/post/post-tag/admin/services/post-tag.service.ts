import { Injectable, Inject } from '@nestjs/common';
import { PostTag } from '@prisma/client';
import { StringUtil } from '@/core/utils/string.util';
import { IPostTagRepository, POST_TAG_REPOSITORY, PostTagFilter } from '@/modules/post/repositories/post-tag.repository.interface';

@Injectable()
export class PostTagService {
  constructor(
    @Inject(POST_TAG_REPOSITORY)
    private readonly tagRepo: IPostTagRepository,
  ) { }

  async getList(query: any) {
    const filter: PostTagFilter = {};
    if (query.search) filter.search = query.search;
    if (query.status !== undefined) filter.status = query.status;

    return this.tagRepo.findAll({
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      filter,
    });
  }

  async getSimpleList(query: any) {
    return this.getList({ ...query, limit: 1000 });
  }

  async getOne(id: number) {
    return this.tagRepo.findById(id);
  }

  async create(data: any) {
    const payload = { ...data };
    this.normalizeSlug(payload);
    return this.tagRepo.create(payload);
  }

  async update(id: number, data: any) {
    const payload = { ...data };
    const current = await this.tagRepo.findById(id);
    this.normalizeSlug(payload, current?.slug);
    return this.tagRepo.update(id, payload);
  }

  async delete(id: number) {
    return this.tagRepo.delete(id);
  }

  private normalizeSlug(data: any, currentSlug?: string) {
    if (data.name && !data.slug) {
      data.slug = StringUtil.toSlug(data.name);
      return;
    }
    if (data.slug) {
      const normalized = StringUtil.toSlug(data.slug);
      if (currentSlug && StringUtil.toSlug(currentSlug) === normalized) {
        delete data.slug;
      } else {
        data.slug = normalized;
      }
    }
  }
}

