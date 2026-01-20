import { Inject, Injectable } from '@nestjs/common';
import { IPostRepository, POST_REPOSITORY, PostFilter } from '@/modules/post/repositories/post.repository.interface';
import { GetPostsDto } from '../dtos/get-posts.dto';

@Injectable()
export class PostService {
  constructor(
    @Inject(POST_REPOSITORY)
    private readonly postRepo: IPostRepository,
  ) { }

  async getList(dto: GetPostsDto) {
    const filter: PostFilter = {
      status: 'published', // Public API always return published posts
      search: dto.search,
      categorySlug: dto.category_slug,
      tagSlug: dto.tag_slug,
      isFeatured: dto.is_featured,
      isPinned: dto.is_pinned,
    };

    const result = await this.postRepo.findAll({
      page: dto.page,
      limit: dto.limit,
      sort: dto.sort,
      filter,
    });

    // Transform data ensures we don't expose sensitive fields and handle active check
    result.data = result.data.map(post => this.transform(post));
    return result;
  }

  async getOne(slug: string) {
    const post = await this.postRepo.findPublishedBySlug(slug);
    return this.transform(post);
  }

  async incrementViewCount(id: number): Promise<void> {
    await this.postRepo.incrementViewCount(id);
  }

  private transform(post: any) {
    if (!post) return post;

    // Logic adapted from previous implementation
    if (post.primary_category) {
      const primary = post.primary_category as any;
      if (primary.status && primary.status !== 'active') {
        post.primary_category = null;
      } else {
        const { id, name, slug, description } = primary;
        post.primary_category = { id, name, slug, description };
      }
    }

    if (Array.isArray(post.categories)) {
      post.categories = (post.categories as any[])
        .map((link) => link?.category)
        .filter(Boolean)
        .filter(cat => cat.status === 'active') // Ensure only active categories
        .map((cat: any) => {
          const { id, name, slug, description } = cat;
          return { id, name, slug, description };
        });
    }

    if (Array.isArray(post.tags)) {
      post.tags = (post.tags as any[])
        .map((link) => link?.tag)
        .filter(Boolean)
        // .filter(tag => tag.status === 'active') // Assuming tags have status, previous code didn't filter explicitly but select did
        .map((tag: any) => {
          const { id, name, slug, description } = tag;
          return { id, name, slug, description };
        });
    }
    return post;
  }
}

