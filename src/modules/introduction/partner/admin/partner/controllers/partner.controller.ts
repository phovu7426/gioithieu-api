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
import { PartnerService } from '@/modules/introduction/partner/admin/partner/services/partner.service';
import { CreatePartnerDto } from '@/modules/introduction/partner/admin/partner/dtos/create-partner.dto';
import { UpdatePartnerDto } from '@/modules/introduction/partner/admin/partner/dtos/update-partner.dto';
import { prepareQuery } from '@/common/base/utils/list-query.helper';
import { LogRequest } from '@/common/decorators/log-request.decorator';
import { Permission } from '@/common/decorators/rbac.decorators';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RbacGuard } from '@/common/guards/rbac.guard';

@Controller('admin/partners')
@UseGuards(JwtAuthGuard, RbacGuard)
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @LogRequest()
  @Post()
  @Permission('partner.manage')
  create(@Body(ValidationPipe) createPartnerDto: CreatePartnerDto) {
    return this.partnerService.create(createPartnerDto);
  }

  @Get()
  @Permission('partner.manage')
  findAll(@Query(ValidationPipe) query: any) {
    const { filters, options } = prepareQuery(query);
    return this.partnerService.getList(filters, options);
  }

  @Get(':id')
  @Permission('partner.manage')
  findOne(@Param('id') id: string) {
    return this.partnerService.getOne({ id: BigInt(id) } as any);
  }

  @Put(':id')
  @Permission('partner.manage')
  update(@Param('id') id: string, @Body(ValidationPipe) updatePartnerDto: UpdatePartnerDto) {
    return this.partnerService.update({ id: BigInt(id) } as any, updatePartnerDto);
  }

  @Delete(':id')
  @Permission('partner.manage')
  remove(@Param('id') id: string) {
    return this.partnerService.delete({ id: BigInt(id) } as any);
  }
}

