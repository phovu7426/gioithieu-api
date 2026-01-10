import { Injectable } from '@nestjs/common';
import { Prisma, Partner } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { PrismaCrudService, PrismaCrudBag } from '@/common/base/services/prisma/prisma-crud.service';

type AdminPartnerBag = PrismaCrudBag & {
  Model: Partner;
  Where: Prisma.PartnerWhereInput;
  Select: Prisma.PartnerSelect;
  Include: Record<string, never>;
  OrderBy: Prisma.PartnerOrderByWithRelationInput;
  Create: Prisma.PartnerCreateInput;
  Update: Prisma.PartnerUpdateInput;
};

@Injectable()
export class PartnerService extends PrismaCrudService<AdminPartnerBag> {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    super(prisma.partner, ['id', 'created_at', 'sort_order'], 'id:DESC');
  }

  protected override prepareOptions(queryOptions: any = {}) {
    const base = super.prepareOptions(queryOptions);
    const orderBy: Prisma.PartnerOrderByWithRelationInput[] = queryOptions?.orderBy ?? [
      { sort_order: 'asc' },
      { created_at: 'desc' },
    ];
    return {
      ...base,
      orderBy,
    };
  }
}

