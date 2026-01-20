import { Injectable, Inject } from '@nestjs/common';
import { IPostCategoryRepository, POST_CATEGORY_REPOSITORY, PostCategoryFilter } from '@/modules/post/repositories/post-category.repository.interface';

@Injectable()
export class PostCategoryService {
  constructor(
    @Inject(POST_CATEGORY_REPOSITORY)
    private readonly categoryRepo: IPostCategoryRepository,
  ) { }

  async getList(query: any) {
    const filter: PostCategoryFilter = {
      status: 'active' as any,
    };
    if (query.parentId !== undefined) filter.parentId = query.parentId;
    if (query.search) filter.search = query.search;

    const result = await this.categoryRepo.findAll({
      page: query.page,
      limit: query.limit,
      sort: query.sort || 'sort_order:ASC',
      filter,
    });

    result.data = result.data.map((item) => this.transform(item));
    return result;
  }

  async findBySlug(slug: string) {
    const category = await this.categoryRepo.findBySlug(slug);
    if (!category || (category as any).status !== 'active') return null;
    return this.transform(category);
  }

  async getOne(id: number) {
    const category = await this.categoryRepo.findById(id);
    return this.transform(category);
  }

  private transform(category: any) {
    if (!category) return category;
    const item = { ...category };
    if (item.id) item.id = Number(item.id);

    if (item.parent) {
      const { id, name, slug } = item.parent;
      item.parent = { id: Number(id), name, slug };
    }
    if (Array.isArray(item.children)) {
      item.children = item.children.map((child: any) => {
        const { id, name, slug } = child;
        return { id: Number(id), name, slug };
      });
    }
    return item;
  }
}

