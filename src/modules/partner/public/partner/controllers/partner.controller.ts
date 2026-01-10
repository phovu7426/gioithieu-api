import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublicPartnerService } from '@/modules/partner/public/partner/services/partner.service';
import { PartnerType } from '@/shared/enums/types/partner-type.enum';
import { prepareQuery } from '@/common/base/utils/list-query.helper';

@Controller('partners')
export class PublicPartnerController {
  constructor(private readonly partnerService: PublicPartnerService) {}

  @Get()
  findAll(@Query() query: any) {
    const { filters, options } = prepareQuery(query);
    return this.partnerService.getList(filters, options);
  }

  @Get('type/:type')
  findByType(@Param('type') type: PartnerType) {
    return this.partnerService.findByType(type);
  }
}

