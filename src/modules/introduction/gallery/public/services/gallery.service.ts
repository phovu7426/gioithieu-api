import { Injectable, Inject } from '@nestjs/common';
import { Gallery } from '@prisma/client';
import { IGalleryRepository, GALLERY_REPOSITORY } from '@/modules/introduction/gallery/repositories/gallery.repository.interface';
import { BasicStatus } from '@/shared/enums/types/basic-status.enum';

@Injectable()
export class PublicGalleryService {
  constructor(
    @Inject(GALLERY_REPOSITORY)
    private readonly galleryRepo: IGalleryRepository,
  ) { }

  async getList(query: any) {
    const filter: any = {
      ...(query.filter || {}),
      status: BasicStatus.active as any,
      deleted_at: null,
    };

    if (query.featured) filter.featured = true;

    const result = await this.galleryRepo.findAll({
      page: query.page,
      limit: query.limit,
      sort: query.sort || 'sort_order:asc,created_at:desc',
      filter,
    });

    result.data = result.data.map(item => this.transform(item));
    return result;
  }

  async findBySlug(slug: string): Promise<Gallery | null> {
    const gallery = await this.galleryRepo.findFirst({
      where: {
        slug,
        status: BasicStatus.active as any,
        deleted_at: null,
      },
    });

    return gallery ? this.transform(gallery) : null;
  }

  async getFeatured(limit: number = 10): Promise<Gallery[]> {
    const result = await this.getList({
      featured: true,
      limit,
      page: 1,
    });
    return result.data;
  }

  private transform(gallery: any) {
    if (!gallery) return gallery;
    const item = { ...gallery };
    if (item.id) item.id = Number(item.id);
    return item;
  }
}

