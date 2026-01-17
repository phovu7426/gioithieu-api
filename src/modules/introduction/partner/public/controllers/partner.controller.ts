import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublicPartnerService } from '@/modules/introduction/partner/public/services/partner.service';
import { PartnerType } from '@/shared/enums/types/partner-type.enum';
import { prepareQuery } from '@/common/base/utils/list-query.helper';
import { Permission } from '@/common/decorators/rbac.decorators';

@Controller('partners')
export class PublicPartnerController {
  constructor(private readonly partnerService: PublicPartnerService) {}

  @Permission('public')
  @Get()
  findAll(@Query() query: any) {
    const { filters, options } = prepareQuery(query);
    return this.partnerService.getList(filters, options);
  }

  @Permission('public')
  @Get('type/:type')
  findByType(@Param('type') type: PartnerType) {
    return this.partnerService.findByType(type);
  }
}

