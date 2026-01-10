import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { PublicFaqService } from '@/modules/common/faq/public/faq/services/faq.service';
import { prepareQuery } from '@/common/base/utils/list-query.helper';
import { Permission } from '@/common/decorators/rbac.decorators';

@Controller('faqs')
export class PublicFaqController {
  constructor(private readonly faqService: PublicFaqService) {}

  @Permission('public')
  @Get()
  findAll(@Query() query: any) {
    const { filters, options } = prepareQuery(query);
    return this.faqService.getList(filters, options);
  }

  @Permission('public')
  @Get('popular')
  getPopular(@Query('limit') limit?: number) {
    return this.faqService.getPopular(limit ? Number(limit) : 10);
  }

  @Permission('public')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const faq = await this.faqService.getOne({ id: BigInt(id) } as any);
    // Increment view count
    await this.faqService.incrementViewCount(Number(id));
    return faq;
  }

  @Permission('public')
  @Post(':id/helpful')
  async markHelpful(@Param('id') id: string) {
    return this.faqService.incrementHelpfulCount(Number(id));
  }
}

