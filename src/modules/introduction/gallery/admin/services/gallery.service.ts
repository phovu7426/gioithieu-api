import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Gallery } from '@prisma/client';
import { IGalleryRepository, GALLERY_REPOSITORY, GalleryFilter } from '@/modules/introduction/gallery/repositories/gallery.repository.interface';
import { BaseContentService } from '@/common/core/services';

@Injectable()
export class GalleryService extends BaseContentService<Gallery, IGalleryRepository> {
  constructor(
    @Inject(GALLERY_REPOSITORY)
    private readonly galleryRepo: IGalleryRepository,
  ) {
    super(galleryRepo);
  }

  protected defaultSort = 'sort_order:asc,created_at:desc';

  async getList(query: any) {
    const filter: GalleryFilter = {};
    if (query.search) filter.search = query.search;
    if (query.status) filter.status = query.status;
    if (query.isFeatured !== undefined) filter.isFeatured = query.isFeatured;

    return super.getList({
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      filter,
    });
  }

  protected async beforeCreate(data: any) {
    const payload = { ...data };
    await this.ensureSlug(payload, undefined, undefined, 'slug', 'title');
    return payload;
  }

  protected async beforeUpdate(id: number | bigint, data: any) {
    const payload = { ...data };
    const current = await this.galleryRepo.findById(id);
    if (!current) throw new NotFoundException('Gallery not found');
    await this.ensureSlug(payload, id, current.slug, 'slug', 'title');
    return payload;
  }

  protected transform(gallery: any) {
    if (!gallery) return gallery;
    return super.transform(gallery);
  }
}

