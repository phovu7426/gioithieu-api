import { Injectable, Inject } from '@nestjs/common';
import { PostTag } from '@prisma/client';
import { IPostTagRepository, POST_TAG_REPOSITORY, PostTagFilter } from '@/modules/post/repositories/post-tag.repository.interface';
import { BaseContentService } from '@/common/core/services';

@Injectable()
export class PostTagService extends BaseContentService<PostTag, IPostTagRepository> {
  constructor(
    @Inject(POST_TAG_REPOSITORY)
    private readonly tagRepo: IPostTagRepository,
  ) {
    super(tagRepo);
  }

  async getList(query: any) {
    const filter: PostTagFilter = {};
    if (query.search) filter.search = query.search;
    if (query.status !== undefined) filter.status = query.status;

    return super.getList({
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      filter,
    });
  }

  async getSimpleList(query: any) {
    return this.getList({ ...query, limit: 1000 });
  }

  protected async beforeCreate(data: any) {
    const payload = { ...data };
    await this.ensureSlug(payload);
    return payload;
  }

  protected async beforeUpdate(id: number | bigint, data: any) {
    const payload = { ...data };
    const current = await this.tagRepo.findById(id);
    await this.ensureSlug(payload, id, current?.slug);
    return payload;
  }
}

