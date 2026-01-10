import { Injectable } from '@nestjs/common';
import { Prisma, Faq } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { PrismaCrudService, PrismaCrudBag } from '@/common/base/services/prisma/prisma-crud.service';

type AdminFaqBag = PrismaCrudBag & {
  Model: Faq;
  Where: Prisma.FaqWhereInput;
  Select: Prisma.FaqSelect;
  Include: Record<string, never>;
  OrderBy: Prisma.FaqOrderByWithRelationInput;
  Create: Prisma.FaqCreateInput;
  Update: Prisma.FaqUpdateInput;
};

@Injectable()
export class FaqService extends PrismaCrudService<AdminFaqBag> {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    super(prisma.faq, ['id', 'created_at', 'sort_order'], 'id:DESC');
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
}

