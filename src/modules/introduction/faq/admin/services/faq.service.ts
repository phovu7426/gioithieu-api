import { Injectable, Inject } from '@nestjs/common';
import { Faq } from '@prisma/client';
import { IFaqRepository, FAQ_REPOSITORY, FaqFilter } from '@/modules/introduction/faq/repositories/faq.repository.interface';
import { BaseContentService } from '@/common/core/services';

@Injectable()
export class FaqService extends BaseContentService<Faq, IFaqRepository> {
  constructor(
    @Inject(FAQ_REPOSITORY)
    private readonly faqRepo: IFaqRepository,
  ) {
    super(faqRepo);
  }

  protected defaultSort = 'sort_order:asc,created_at:desc';

  async getList(query: any) {
    const filter: FaqFilter = {};
    if (query.search) filter.search = query.search;
    if (query.status) filter.status = query.status;

    return super.getList({
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      filter,
    });
  }
}

