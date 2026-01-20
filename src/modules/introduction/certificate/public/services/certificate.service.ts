import { Injectable, Inject } from '@nestjs/common';
import { Certificate } from '@prisma/client';
import { ICertificateRepository, CERTIFICATE_REPOSITORY } from '@/modules/introduction/certificate/repositories/certificate.repository.interface';
import { BasicStatus } from '@/shared/enums/types/basic-status.enum';
import { CertificateType } from '@/shared/enums/types/certificate-type.enum';

@Injectable()
export class PublicCertificateService {
  constructor(
    @Inject(CERTIFICATE_REPOSITORY)
    private readonly certificateRepo: ICertificateRepository,
  ) { }

  async getList(query: any) {
    const filter: any = {
      ...(query.filter || {}),
      status: BasicStatus.active as any,
      deleted_at: null,
    };

    if (query.type) filter.type = query.type;

    const result = await this.certificateRepo.findAll({
      page: query.page,
      limit: query.limit,
      sort: query.sort || 'sort_order:asc,created_at:desc',
      filter,
    });

    result.data = result.data.map(item => this.transform(item));
    return result;
  }

  async findByType(type: CertificateType): Promise<Certificate[]> {
    const result = await this.getList({
      type,
      limit: 100,
      page: 1,
    });
    return result.data;
  }

  private transform(certificate: any) {
    if (!certificate) return certificate;
    const item = { ...certificate };
    if (item.id) item.id = Number(item.id);
    return item;
  }
}

