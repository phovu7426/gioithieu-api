import { Injectable } from '@nestjs/common';
import { Prisma, Certificate } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { BasicStatus } from '@/shared/enums/types/basic-status.enum';
import { CertificateType } from '@/shared/enums/types/certificate-type.enum';
import { PrismaListService, PrismaListBag } from '@/common/base/services/prisma/prisma-list.service';

type PublicCertificateBag = PrismaListBag & {
  Model: Certificate;
  Where: Prisma.CertificateWhereInput;
  Select: Prisma.CertificateSelect;
  Include: Record<string, never>;
  OrderBy: Prisma.CertificateOrderByWithRelationInput;
};

@Injectable()
export class PublicCertificateService extends PrismaListService<PublicCertificateBag> {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    super(prisma.certificate, ['id', 'created_at', 'sort_order'], 'id:DESC');
  }

  protected override async prepareFilters(
    filters?: Prisma.CertificateWhereInput,
  ): Promise<Prisma.CertificateWhereInput | true | undefined> {
    const prepared: Prisma.CertificateWhereInput = {
      ...(filters || {}),
      status: BasicStatus.active as any,
      deleted_at: null,
    };
    return prepared;
  }

  protected override prepareOptions(queryOptions: any = {}) {
    const base = super.prepareOptions(queryOptions);
    const orderBy: Prisma.CertificateOrderByWithRelationInput[] = queryOptions?.orderBy ?? [
      { sort_order: 'asc' },
      { created_at: 'desc' },
    ];
    return {
      ...base,
      orderBy,
    };
  }

  async findByType(type: CertificateType): Promise<Certificate[]> {
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

