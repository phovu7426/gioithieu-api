import { Injectable } from '@nestjs/common';
import { Prisma, Certificate } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { PrismaCrudService, PrismaCrudBag } from '@/common/base/services/prisma/prisma-crud.service';

type AdminCertificateBag = PrismaCrudBag & {
  Model: Certificate;
  Where: Prisma.CertificateWhereInput;
  Select: Prisma.CertificateSelect;
  Include: Record<string, never>;
  OrderBy: Prisma.CertificateOrderByWithRelationInput;
  Create: Prisma.CertificateCreateInput;
  Update: Prisma.CertificateUpdateInput;
};

@Injectable()
export class CertificateService extends PrismaCrudService<AdminCertificateBag> {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    super(prisma.certificate, ['id', 'created_at', 'sort_order'], 'id:DESC');
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
}

