import { Injectable, Inject } from '@nestjs/common';
import { Certificate } from '@prisma/client';
import { ICertificateRepository, CERTIFICATE_REPOSITORY } from '@/modules/introduction/certificate/repositories/certificate.repository.interface';
import { BasicStatus } from '@/shared/enums/types/basic-status.enum';
import { CertificateType } from '@/shared/enums/types/certificate-type.enum';
import { BaseService } from '@/common/core/services';

@Injectable()
export class PublicCertificateService extends BaseService<Certificate, ICertificateRepository> {
  constructor(
    @Inject(CERTIFICATE_REPOSITORY)
    private readonly certificateRepo: ICertificateRepository,
  ) {
    super(certificateRepo);
  }

  async getList(query: any) {
    const filter: any = {
      status: BasicStatus.active as any,
    };

    if (query.type) filter.type = query.type;

    return super.getList({
      page: query.page,
      limit: query.limit,
      sort: query.sort || 'sort_order:asc,created_at:desc',
      filter,
    });
  }

  async findByType(type: CertificateType): Promise<Certificate[]> {
    const result = await this.getList({
      type,
      limit: 100,
      page: 1,
    });
    return result.data;
  }
}

