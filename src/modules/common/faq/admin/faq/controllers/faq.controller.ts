import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { FaqService } from '@/modules/common/faq/admin/faq/services/faq.service';
import { CreateFaqDto } from '@/modules/common/faq/admin/faq/dtos/create-faq.dto';
import { UpdateFaqDto } from '@/modules/common/faq/admin/faq/dtos/update-faq.dto';
import { prepareQuery } from '@/common/base/utils/list-query.helper';
import { LogRequest } from '@/common/decorators/log-request.decorator';
import { Permission } from '@/common/decorators/rbac.decorators';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RbacGuard } from '@/common/guards/rbac.guard';

@Controller('admin/faqs')
@UseGuards(JwtAuthGuard, RbacGuard)
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @LogRequest()
  @Post()
  @Permission('faq.manage')
  create(@Body(ValidationPipe) createFaqDto: CreateFaqDto) {
    return this.faqService.create(createFaqDto);
  }

  @Get()
  @Permission('faq.manage')
  findAll(@Query(ValidationPipe) query: any) {
    const { filters, options } = prepareQuery(query);
    return this.faqService.getList(filters, options);
  }

  @Get(':id')
  @Permission('faq.manage')
  findOne(@Param('id') id: string) {
    return this.faqService.getOne({ id: BigInt(id) } as any);
  }

  @Put(':id')
  @Permission('faq.manage')
  update(@Param('id') id: string, @Body(ValidationPipe) updateFaqDto: UpdateFaqDto) {
    return this.faqService.update({ id: BigInt(id) } as any, updateFaqDto);
  }

  @Delete(':id')
  @Permission('faq.manage')
  remove(@Param('id') id: string) {
    return this.faqService.delete({ id: BigInt(id) } as any);
  }
}

