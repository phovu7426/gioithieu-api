import { Inject, Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { IPostRepository, POST_REPOSITORY, PostFilter } from '@/modules/post/repositories/post.repository.interface';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { BaseContentService } from '@/common/base/services';

@Injectable()
export class PostService extends BaseContentService<Post, IPostRepository> {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepo: IPostRepository,
  ) {
    super(postRepo);
  }

  async getList(dto: GetPostsDto) {
    const filter: PostFilter = {
      status: 'published', // Public API always return published posts
      search: dto.search,
      categorySlug: dto.category_slug,
      tagSlug: dto.tag_slug,
      isFeatured: dto.is_featured,
      isPinned: dto.is_pinned,
    };

    return super.getList({
      page: dto.page,
      limit: dto.limit,
      sort: dto.sort,
      filter,
    });
  }

  async getOneBySlug(slug: string) {
    const post = await this.postRepo.findPublishedBySlug(slug);
    return this.transform(post);
  }

  // Keep original name for compatibility if needed, though getOneBySlug is clearer
  async getOne(slug: string) {
    return this.getOneBySlug(slug);
  }

  // No need to override incrementViewCount as BaseContentService now handles it automatically
  // by delegating to the specialized repository method if it exists.

  protected transform(post: any) {
    if (!post) return post;

    const p = super.transform(post) as any;

    // Logic adapted from previous implementation
    if (p.primary_category) {
      const primary = p.primary_category as any;
      if (primary.status && primary.status !== 'active') {
        p.primary_category = null;
      } else {
        const { id, name, slug, description } = primary;
        p.primary_category = { id, name, slug, description };
      }
    }

    if (Array.isArray(p.categories)) {
      p.categories = (p.categories as any[])
        .map((link) => link?.category)
        .filter(Boolean)
        .filter(cat => cat.status === 'active') // Ensure only active categories
        .map((cat: any) => {
          const { id, name, slug, description } = cat;
          return { id, name, slug, description };
        });
    }

    if (Array.isArray(p.tags)) {
      p.tags = (p.tags as any[])
        .map((link) => link?.tag)
        .filter(Boolean)
        .map((tag: any) => {
          const { id, name, slug, description } = tag;
          return { id, name, slug, description };
        });
    }
    return p;
  }
}

