import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ListActiveFaqsUseCase } from '@/application/use-cases/introduction/faq/queries/public/list-active-faqs.usecase';
import { ListPopularFaqsUseCase } from '@/application/use-cases/introduction/faq/queries/public/list-popular-faqs.usecase';
import { GetPublicFaqUseCase } from '@/application/use-cases/introduction/faq/queries/public/get-public-faq.usecase';
import { MarkFaqHelpfulUseCase } from '@/application/use-cases/introduction/faq/commands/mark-helpful/mark-helpful.usecase';
import { Permission } from '@/common/decorators/rbac.decorators';

@ApiTags('Public / FAQ')
@Controller('faqs')
export class PublicFaqController {
  constructor(
    private readonly listActiveUseCase: ListActiveFaqsUseCase,
    private readonly listPopularUseCase: ListPopularFaqsUseCase,
    private readonly getUseCase: GetPublicFaqUseCase,
    private readonly markHelpfulUseCase: MarkFaqHelpfulUseCase,
  ) { }

  @ApiOperation({ summary: 'List all active FAQs' })
  @Permission('public')
  @Get()
  findAll() {
    return this.listActiveUseCase.execute();
  }

  @ApiOperation({ summary: 'Get popular FAQs' })
  @Permission('public')
  @Get('popular')
  getPopular(@Query('limit') limit?: number) {
    return this.listPopularUseCase.execute(limit ? Number(limit) : 10);
  }

  @ApiOperation({ summary: 'Get FAQ details' })
  @Permission('public')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.getUseCase.execute(BigInt(id));
  }

  @ApiOperation({ summary: 'Mark FAQ as helpful' })
  @Permission('public')
  @Post(':id/helpful')
  async markHelpful(@Param('id') id: string) {
    return this.markHelpfulUseCase.execute(BigInt(id));
  }
}

