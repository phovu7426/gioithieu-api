import { Injectable, Inject } from '@nestjs/common';
import { ICertificateRepository, CERTIFICATE_REPOSITORY, CertificateFilter } from '@/modules/introduction/certificate/repositories/certificate.repository.interface';

@Injectable()
export class CertificateService {
  constructor(
    @Inject(CERTIFICATE_REPOSITORY)
    private readonly certificateRepo: ICertificateRepository,
  ) { }

  async getList(query: any) {
    const filter: CertificateFilter = {};
    if (query.search) filter.search = query.search;
    if (query.status) filter.status = query.status;

    const result = await this.certificateRepo.findAll({
      page: query.page,
      limit: query.limit,
      sort: query.sort || 'sort_order:ASC,created_at:DESC',
      filter,
    });

    result.data = result.data.map((item) => this.transform(item));
    return result;
  }

  async getOne(id: number) {
    const certificate = await this.certificateRepo.findById(id);
    return this.transform(certificate);
  }

  async create(data: any) {
    const certificate = await this.certificateRepo.create(data);
    return this.getOne(Number(certificate.id));
  }

  async update(id: number, data: any) {
    await this.certificateRepo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    return this.certificateRepo.delete(id);
  }

  private transform(certificate: any) {
    if (!certificate) return certificate;
    const item = { ...certificate };
    if (item.id) item.id = Number(item.id);
    return item;
  }
}

