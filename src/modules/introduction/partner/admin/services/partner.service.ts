import { Injectable, Inject } from '@nestjs/common';
import { IPartnerRepository, PARTNER_REPOSITORY, PartnerFilter } from '@/modules/introduction/partner/repositories/partner.repository.interface';
import { BaseContentService } from '@/common/base/services';
import { Partner } from '@prisma/client';

@Injectable()
export class PartnerService extends BaseContentService<Partner, IPartnerRepository> {
  constructor(
    @Inject(PARTNER_REPOSITORY)
    private readonly partnerRepo: IPartnerRepository,
  ) {
    super(partnerRepo);
  }

  protected defaultSort = 'sort_order:asc,created_at:desc';

  async getList(query: any) {
    const filter: PartnerFilter = {};
    if (query.search) filter.search = query.search;
    if (query.status) filter.status = query.status;
    if (query.type) filter.type = query.type;

    return super.getList({
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      filter,
    });
  }

  async getSimpleList(query: any) {
    return this.getList({
      ...query,
      limit: query.limit ?? 50,
    });
  }
}

