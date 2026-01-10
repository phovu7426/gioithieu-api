import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { PublicFaqService } from '@/modules/faq/public/faq/services/faq.service';
import { prepareQuery } from '@/common/base/utils/list-query.helper';

@Controller('faqs')
export class PublicFaqController {
  constructor(private readonly faqService: PublicFaqService) {}

  @Get()
  findAll(@Query() query: any) {
    const { filters, options } = prepareQuery(query);
    return this.faqService.getList(filters, options);
  }

  @Get('popular')
  getPopular(@Query('limit') limit?: number) {
    return this.faqService.getPopular(limit ? Number(limit) : 10);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const faq = await this.faqService.getOne({ id: BigInt(id) } as any);
    // Increment view count
    await this.faqService.incrementViewCount(Number(id));
    return faq;
  }

  @Post(':id/helpful')
  async markHelpful(@Param('id') id: string) {
    return this.faqService.incrementHelpfulCount(Number(id));
  }
}

