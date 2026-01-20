import { Injectable, Inject } from '@nestjs/common';
import { IFaqRepository, FAQ_REPOSITORY, FaqFilter } from '@/modules/common/faq/repositories/faq.repository.interface';

@Injectable()
export class FaqService {
  constructor(
    @Inject(FAQ_REPOSITORY)
    private readonly faqRepo: IFaqRepository,
  ) { }

  async getList(query: any) {
    const filter: FaqFilter = {};
    if (query.search) filter.search = query.search;
    if (query.status) filter.status = query.status;

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
    return this.transform(faq);
  }

  async create(data: any) {
    const faq = await this.faqRepo.create(data);
    return this.getOne(Number(faq.id));
  }

  async update(id: number, data: any) {
    await this.faqRepo.update(id, data);
    return this.getOne(id);
  }

  async delete(id: number) {
    return this.faqRepo.delete(id);
  }

  private transform(faq: any) {
    if (!faq) return faq;
    const item = { ...faq };
    if (item.id) item.id = Number(item.id);
    return item;
  }
}

