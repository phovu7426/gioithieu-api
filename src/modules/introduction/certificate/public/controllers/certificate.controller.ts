import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublicCertificateService } from '@/modules/introduction/certificate/public/services/certificate.service';
import { CertificateType } from '@/shared/enums/types/certificate-type.enum';
import { prepareQuery } from '@/common/base/utils/list-query.helper';
import { Permission } from '@/common/decorators/rbac.decorators';

@Controller('certificates')
export class PublicCertificateController {
  constructor(private readonly certificateService: PublicCertificateService) {}

  @Permission('public')
  @Get()
  findAll(@Query() query: any) {
    const { filters, options } = prepareQuery(query);
    return this.certificateService.getList(filters, options);
  }

  @Permission('public')
  @Get('type/:type')
  findByType(@Param('type') type: CertificateType) {
    return this.certificateService.findByType(type);
  }
}

