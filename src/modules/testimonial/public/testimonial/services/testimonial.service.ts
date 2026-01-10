import { Injectable } from '@nestjs/common';
import { Prisma, Testimonial } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { BasicStatus } from '@/shared/enums/types/basic-status.enum';
import { PrismaListService, PrismaListBag } from '@/common/base/services/prisma/prisma-list.service';

type PublicTestimonialBag = PrismaListBag & {
  Model: Testimonial;
  Where: Prisma.TestimonialWhereInput;
  Select: Prisma.TestimonialSelect;
  Include: Prisma.TestimonialInclude;
  OrderBy: Prisma.TestimonialOrderByWithRelationInput;
};

@Injectable()
export class PublicTestimonialService extends PrismaListService<PublicTestimonialBag> {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    super(prisma.testimonial, ['id', 'created_at', 'sort_order'], 'id:DESC');
  }

  protected override async prepareFilters(
    filters?: Prisma.TestimonialWhereInput,
  ): Promise<Prisma.TestimonialWhereInput | true | undefined> {
    const prepared: Prisma.TestimonialWhereInput = {
      ...(filters || {}),
      status: BasicStatus.active as any,
      deleted_at: null,
    };
    return prepared;
  }

  protected override prepareOptions(queryOptions: any = {}) {
    const base = super.prepareOptions(queryOptions);
    const orderBy: Prisma.TestimonialOrderByWithRelationInput[] = queryOptions?.orderBy ?? [
      { sort_order: 'asc' },
      { created_at: 'desc' },
    ];
    return {
      ...base,
      include: {
        project: true,
      },
      orderBy,
    };
  }

  async getFeatured(limit: number = 10): Promise<Testimonial[]> {
    const result = await this.getList(
      {
        featured: true,
        status: BasicStatus.active as any,
      } as any,
      { limit, page: 1 },
    );
    return result.data;
  }

  async findByProject(projectId: number): Promise<Testimonial[]> {
    const result = await this.getList(
      {
        project_id: BigInt(projectId),
        status: BasicStatus.active as any,
      } as any,
      { limit: 100, page: 1 },
    );
    return result.data;
  }
}

