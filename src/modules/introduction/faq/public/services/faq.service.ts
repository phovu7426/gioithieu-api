import { Injectable, Inject } from '@nestjs/common';
import { IFaqRepository, FAQ_REPOSITORY, FaqFilter } from '@/modules/introduction/faq/repositories/faq.repository.interface';

@Injectable()
export class PublicFaqService {
  constructor(
    @Inject(FAQ_REPOSITORY)
    private readonly faqRepo: IFaqRepository,
  ) { }

  async getList(query: any) {
    const filter: FaqFilter = {
      status: 'active',
    };
    if (query.search) filter.search = query.search;

    const result = await this.faqRepo.findAll({
      page: query.page,
      limit: query.limit,
      sort: query.sort || 'sort_order:asc,created_at:desc',
      filter,
    });

    result.data = result.data.map((item) => this.transform(item));
    return result;
  }

  async getOne(id: number) {
    const faq = await this.faqRepo.findById(id);
    if (!faq || (faq as any).status !== 'active') return null;
    return this.transform(faq);
  }

  async getPopular(limit: number = 10) {
    const result = await this.faqRepo.findAll({
      page: 1,
      limit,
      sort: 'view_count:desc',
      filter: { status: 'active' },
    });
    return result.data.map(item => this.transform(item));
  }

  async incrementViewCount(id: number) {
    return this.faqRepo.incrementViewCount(id);
  }

  async incrementHelpfulCount(id: number) {
    return this.faqRepo.incrementHelpfulCount(id);
  }

  private transform(faq: any) {
    if (!faq) return faq;
    const item = { ...faq };
    if (item.id) item.id = Number(item.id);
    if (item.view_count) item.view_count = Number(item.view_count);
    if (item.helpful_count) item.helpful_count = Number(item.helpful_count);
    return item;
  }
}

