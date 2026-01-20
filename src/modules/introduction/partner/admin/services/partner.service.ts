import { Injectable, Inject } from '@nestjs/common';
import { IPartnerRepository, PARTNER_REPOSITORY, PartnerFilter } from '@/modules/introduction/partner/repositories/partner.repository.interface';

@Injectable()
export class PartnerService {
  constructor(
    @Inject(PARTNER_REPOSITORY)
    private readonly partnerRepo: IPartnerRepository,
  ) { }

  async getList(query: any) {
    const filter: PartnerFilter = {};
    if (query.search) filter.search = query.search;
    if (query.status) filter.status = query.status;
    if (query.type) filter.type = query.type;

    const result = await this.partnerRepo.findAll({
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      filter,
    });

    result.data = result.data.map(item => this.transform(item));
    return result;
  }

  async getSimpleList(query: any) {
    return this.getList({
      ...query,
      limit: query.limit ?? 50,
    });
  }

  async getOne(id: number) {
    const partner = await this.partnerRepo.findById(id);
    return this.transform(partner);
  }

  async create(data: any) {
    const partner = await this.partnerRepo.create(data);
    return this.getOne(Number(partner.id));
  }

  async update(id: number, data: any) {
    await this.partnerRepo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    return this.partnerRepo.delete(id);
  }

  async changeStatus(id: number, status: string) {
    return this.update(id, { status: status as any });
  }

  async updateSortOrder(id: number, sortOrder: number) {
    return this.update(id, { sort_order: sortOrder });
  }

  private transform(partner: any) {
    if (!partner) return partner;
    const item = { ...partner };
    if (item.id) item.id = Number(item.id);
    return item;
  }
}

