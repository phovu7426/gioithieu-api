import { Injectable } from '@nestjs/common';
import { Prisma, Faq } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { BasicStatus } from '@/shared/enums/types/basic-status.enum';
import { PrismaListService, PrismaListBag } from '@/common/base/services/prisma/prisma-list.service';

type PublicFaqBag = PrismaListBag & {
  Model: Faq;
  Where: Prisma.FaqWhereInput;
  Select: Prisma.FaqSelect;
  Include: Record<string, never>;
  OrderBy: Prisma.FaqOrderByWithRelationInput;
};

@Injectable()
export class PublicFaqService extends PrismaListService<PublicFaqBag> {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    super(prisma.faq, ['id', 'created_at', 'sort_order'], 'id:DESC');
  }

  protected override async prepareFilters(
    filters?: Prisma.FaqWhereInput,
  ): Promise<Prisma.FaqWhereInput | true | undefined> {
    const prepared: Prisma.FaqWhereInput = {
      ...(filters || {}),
      status: BasicStatus.active as any,
      deleted_at: null,
    };
    return prepared;
  }

  protected override prepareOptions(queryOptions: any = {}) {
    const base = super.prepareOptions(queryOptions);
    const orderBy: Prisma.FaqOrderByWithRelationInput[] = queryOptions?.orderBy ?? [
      { sort_order: 'asc' },
      { created_at: 'desc' },
    ];
    return {
      ...base,
      orderBy,
    };
  }

  async getPopular(limit: number = 10): Promise<Faq[]> {
    const result = await this.getList(
      {
        status: BasicStatus.active as any,
      } as any,
      {
        limit,
        page: 1,
        orderBy: [{ view_count: 'desc' }],
      },
    );
    return result.data;
  }

  async incrementViewCount(id: number) {
    const faq = await this.prisma.faq.findFirst({
      where: { id: BigInt(id) },
    });

    if (!faq) {
      return null;
    }

    return this.prisma.faq.update({
      where: { id: BigInt(id) },
      data: { view_count: { increment: 1 } },
    });
  }

  async incrementHelpfulCount(id: number) {
    const faq = await this.prisma.faq.findFirst({
      where: { id: BigInt(id) },
    });

    if (!faq) {
      return null;
    }

    return this.prisma.faq.update({
      where: { id: BigInt(id) },
      data: { helpful_count: { increment: 1 } },
    });
  }
}

