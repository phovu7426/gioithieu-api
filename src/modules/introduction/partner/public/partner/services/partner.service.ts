import { Injectable } from '@nestjs/common';
import { Prisma, Partner } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { BasicStatus } from '@/shared/enums/types/basic-status.enum';
import { PartnerType } from '@/shared/enums/types/partner-type.enum';
import { PrismaListService, PrismaListBag } from '@/common/base/services/prisma/prisma-list.service';

type PublicPartnerBag = PrismaListBag & {
  Model: Partner;
  Where: Prisma.PartnerWhereInput;
  Select: Prisma.PartnerSelect;
  Include: Record<string, never>;
  OrderBy: Prisma.PartnerOrderByWithRelationInput;
};

@Injectable()
export class PublicPartnerService extends PrismaListService<PublicPartnerBag> {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    super(prisma.partner, ['id', 'created_at', 'sort_order'], 'id:DESC');
  }

  protected override async prepareFilters(
    filters?: Prisma.PartnerWhereInput,
  ): Promise<Prisma.PartnerWhereInput | true | undefined> {
    const prepared: Prisma.PartnerWhereInput = {
      ...(filters || {}),
      status: BasicStatus.active as any,
      deleted_at: null,
    };
    return prepared;
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

  async findByType(type: PartnerType): Promise<Partner[]> {
    const result = await this.getList(
      {
        type: type as any,
        status: BasicStatus.active as any,
      } as any,
      { limit: 100, page: 1 },
    );
    return result.data;
  }
}

