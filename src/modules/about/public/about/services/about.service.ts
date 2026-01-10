import { Injectable } from '@nestjs/common';
import { Prisma, AboutSection } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { BasicStatus } from '@/shared/enums/types/basic-status.enum';
import { AboutSectionType } from '@/shared/enums/types/about-section-type.enum';
import { PrismaListService, PrismaListBag } from '@/common/base/services/prisma/prisma-list.service';

type PublicAboutBag = PrismaListBag & {
  Model: AboutSection;
  Where: Prisma.AboutSectionWhereInput;
  Select: Prisma.AboutSectionSelect;
  Include: Record<string, never>;
  OrderBy: Prisma.AboutSectionOrderByWithRelationInput;
};

@Injectable()
export class PublicAboutService extends PrismaListService<PublicAboutBag> {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    super(prisma.aboutSection, ['id', 'created_at', 'sort_order'], 'id:DESC');
  }

  protected override async prepareFilters(
    filters?: Prisma.AboutSectionWhereInput,
  ): Promise<Prisma.AboutSectionWhereInput | true | undefined> {
    const prepared: Prisma.AboutSectionWhereInput = {
      ...(filters || {}),
      status: BasicStatus.active as any,
      deleted_at: null,
    };
    return prepared;
  }

  protected override prepareOptions(queryOptions: any = {}) {
    const base = super.prepareOptions(queryOptions);
    const orderBy: Prisma.AboutSectionOrderByWithRelationInput[] = queryOptions?.orderBy ?? [
      { sort_order: 'asc' },
      { created_at: 'desc' },
    ];
    return {
      ...base,
      orderBy,
    };
  }

  async findBySlug(slug: string): Promise<AboutSection | null> {
    return this.prisma.aboutSection.findFirst({
      where: {
        slug,
        status: BasicStatus.active as any,
        deleted_at: null,
      },
    });
  }

  async findByType(type: AboutSectionType): Promise<AboutSection[]> {
    const result = await this.getList(
      {
        section_type: type as any,
        status: BasicStatus.active as any,
      } as any,
      { limit: 100, page: 1 },
    );
    return result.data;
  }
}

