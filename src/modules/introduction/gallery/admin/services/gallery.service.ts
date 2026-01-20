import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Gallery } from '@prisma/client';
import { IGalleryRepository, GALLERY_REPOSITORY, GalleryFilter } from '@/modules/introduction/gallery/repositories/gallery.repository.interface';
import { StringUtil } from '@/core/utils/string.util';

@Injectable()
export class GalleryService {
  constructor(
    @Inject(GALLERY_REPOSITORY)
    private readonly galleryRepo: IGalleryRepository,
  ) { }

  async getList(query: any) {
    const filter: GalleryFilter = {};
    if (query.search) filter.search = query.search;
    if (query.status) filter.status = query.status;
    if (query.isFeatured !== undefined) filter.isFeatured = query.isFeatured;

    const result = await this.galleryRepo.findAll({
      page: query.page,
      limit: query.limit,
      sort: query.sort || 'sort_order:asc,created_at:desc',
      filter,
    });

    result.data = result.data.map(item => this.transform(item));
    return result;
  }

  async getOne(id: number) {
    const gallery = await this.galleryRepo.findById(id);
    return this.transform(gallery);
  }

  async create(data: any) {
    const payload = { ...data };
    await this.ensureSlug(payload);
    const gallery = await this.galleryRepo.create(payload);
    return this.getOne(Number(gallery.id));
  }

  async update(id: number, data: any) {
    const payload = { ...data };
    const current = await this.galleryRepo.findById(id);
    if (!current) throw new NotFoundException('Gallery not found');
    await this.ensureSlug(payload, id, current.slug);
    await this.galleryRepo.update(id, payload);
    return this.getOne(id);
  }

  async delete(id: number) {
    return this.galleryRepo.delete(id);
  }

  private async ensureSlug(data: any, excludeId?: number, currentSlug?: string): Promise<void> {
    if (data.title && !data.slug) {
      data.slug = StringUtil.toSlug(data.title);
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

    const exists = await this.galleryRepo.findBySlug(normalizedSlug);
    if (exists && (!excludeId || Number(exists.id) !== excludeId)) {
      let counter = 1;
      let uniqueSlug = `${normalizedSlug}-${counter}`;
      while (await this.galleryRepo.findBySlug(uniqueSlug)) {
        counter++;
        uniqueSlug = `${normalizedSlug}-${counter}`;
      }
      data.slug = uniqueSlug;
    }
  }

  private transform(gallery: any) {
    if (!gallery) return gallery;
    const item = { ...gallery };
    if (item.id) item.id = Number(item.id);
    if (item.created_user_id) item.created_user_id = Number(item.created_user_id);
    if (item.updated_user_id) item.updated_user_id = Number(item.updated_user_id);
    return item;
  }
}

