import { Injectable, Inject } from '@nestjs/common';
import { IPartnerRepository, PARTNER_REPOSITORY, PartnerFilter } from '@/modules/introduction/partner/repositories/partner.repository.interface';
import { BasicStatus } from '@/shared/enums/types/basic-status.enum';
import { PartnerType } from '@/shared/enums/types/partner-type.enum';

@Injectable()
export class PublicPartnerService {
  constructor(
    @Inject(PARTNER_REPOSITORY)
    private readonly partnerRepo: IPartnerRepository,
  ) { }

  async getList(query: any) {
    const filter: PartnerFilter = {
      status: BasicStatus.active
    };
    if (query.search) filter.search = query.search;
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

  async findByType(type: PartnerType) {
    const result = await this.getList({ type, limit: 100, page: 1 } as any);
    return result.data;
  }

  private transform(partner: any) {
    if (!partner) return partner;
    const item = { ...partner };
    if (item.id) item.id = Number(item.id);
    return item;
  }
}

