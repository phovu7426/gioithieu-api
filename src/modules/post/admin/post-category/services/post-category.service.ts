import { Injectable, Inject } from '@nestjs/common';
import { PostCategory } from '@prisma/client';
import { StringUtil } from '@/core/utils/string.util';
import { IPostCategoryRepository, POST_CATEGORY_REPOSITORY, PostCategoryFilter } from '@/modules/post/repositories/post-category.repository.interface';

@Injectable()
export class PostCategoryService {
  constructor(
    @Inject(POST_CATEGORY_REPOSITORY)
    private readonly categoryRepo: IPostCategoryRepository,
  ) { }

  async getList(query: any) {
    const filter: PostCategoryFilter = {};
    if (query.search) filter.search = query.search;
    if (query.status !== undefined) filter.status = query.status;
    if (query.parentId !== undefined) filter.parentId = query.parentId;

    const result = await this.categoryRepo.findAll({
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      filter,
    });

    result.data = result.data.map((item) => this.transform(item));
    return result;
  }

  async getSimpleList(query: any) {
    return this.getList({
      ...query,
      limit: 1000,
      sort: query.sort ?? 'sort_order:ASC'
    });
  }

  async getOne(id: number) {
    const category = await this.categoryRepo.findById(id);
    return this.transform(category);
  }

  async create(data: any) {
    const payload = { ...data };
    this.normalizeSlug(payload);
    payload.parent_id = this.toBigInt(payload.parent_id);
    const category = await this.categoryRepo.create(payload);
    return this.getOne(Number(category.id));
  }

  async update(id: number, data: any) {
    const payload = { ...data };
    const current = await this.categoryRepo.findById(id);
    this.normalizeSlug(payload, current?.slug);
    payload.parent_id = this.toBigInt(payload.parent_id);
    await this.categoryRepo.update(id, payload);
    return this.getOne(id);
  }

  async delete(id: number) {
    return this.categoryRepo.delete(id);
  }

  private transform(category: any) {
    if (!category) return category;
    const item = { ...category };
    if (item.parent) {
      const { id, name, slug } = item.parent;
      item.parent = { id, name, slug };
    }
    if (Array.isArray(item.children)) {
      item.children = item.children.map((child: any) => {
        const { id, name, slug } = child;
        return { id, name, slug };
      });
    }
    return item;
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

  private toBigInt(value?: number | string | bigint | null): bigint | null {
    if (value === null || value === undefined) return null;
    if (typeof value === 'bigint') return value;
    const num = typeof value === 'string' ? Number(value) : value;
    if (Number.isNaN(num)) return null;
    return BigInt(num);
  }
}

