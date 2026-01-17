import { Injectable } from '@nestjs/common';
import { Prisma, Gallery } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { BasicStatus } from '@/shared/enums/types/basic-status.enum';
import { PrismaListService, PrismaListBag } from '@/common/base/services/prisma/prisma-list.service';


type PublicGalleryBag = PrismaListBag & {
  Model: Gallery;
  Where: Prisma.GalleryWhereInput;
  Select: Prisma.GallerySelect;
  Include: Record<string, never>;
  OrderBy: Prisma.GalleryOrderByWithRelationInput;
};

@Injectable()
export class PublicGalleryService extends PrismaListService<PublicGalleryBag> {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    super(prisma.gallery, ['id', 'created_at', 'sort_order'], 'id:DESC');
  }

  protected override async prepareFilters(
    filters?: Prisma.GalleryWhereInput,
  ): Promise<Prisma.GalleryWhereInput | true | undefined> {
    const prepared: Prisma.GalleryWhereInput = {
      ...(filters || {}),
      status: BasicStatus.active as any,
      deleted_at: null,
    };
    return prepared;
  }

  protected override prepareOptions(queryOptions: any = {}) {
    const base = super.prepareOptions(queryOptions);
    const orderBy: Prisma.GalleryOrderByWithRelationInput[] = queryOptions?.orderBy ?? [
      { sort_order: 'asc' },
      { created_at: 'desc' },
    ];
    return {
      ...base,
      orderBy,
    };
  }

  async findBySlug(slug: string): Promise<Gallery | null> {
    const gallery = await this.prisma.gallery.findFirst({
      where: {
        slug,
        status: BasicStatus.active as any,
        deleted_at: null,
      },
    });

    return gallery ? gallery : null;
  }

  async getFeatured(limit: number = 10): Promise<Gallery[]> {
    const result = await this.getList(
      {
        featured: true,
        status: BasicStatus.active as any,
      } as any,
      { limit, page: 1 },
    );
    return result.data;
  }
}

