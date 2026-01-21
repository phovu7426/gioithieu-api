import { Injectable, Inject } from '@nestjs/common';
import { IGalleryRepository, GALLERY_REPOSITORY } from '@/modules/introduction/gallery/repositories/gallery.repository.interface';
import { BasicStatus } from '@/shared/enums/types/basic-status.enum';
import { BaseService } from '@/common/core/services';

@Injectable()
export class PublicGalleryService extends BaseService<any, IGalleryRepository> {
  constructor(
    @Inject(GALLERY_REPOSITORY)
    private readonly galleryRepo: IGalleryRepository,
  ) {
    super(galleryRepo);
  }

  async getList(query: any) {
    const filter: any = {
      ...(query.filter || {}),
      status: BasicStatus.active as any,
    };

    if (query.featured) filter.featured = true;

    return super.getList({
      page: query.page,
      limit: query.limit,
      sort: query.sort || 'sort_order:asc,created_at:desc',
      filter,
    });
  }

  async findBySlug(slug: string): Promise<any | null> {
    const gallery = await this.galleryRepo.findFirst({
      where: {
        slug,
        status: BasicStatus.active as any,
        deleted_at: null,
      },
    });

    return gallery ? this.transform(gallery) : null;
  }

  async getFeatured(limit: number = 10): Promise<any[]> {
    const result = await this.getList({
      featured: true,
      limit,
      page: 1,
    });
    return result.data as any[];
  }
}

