import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublicCertificateService } from '@/modules/certificate/public/certificate/services/certificate.service';
import { CertificateType } from '@/shared/enums/types/certificate-type.enum';
import { prepareQuery } from '@/common/base/utils/list-query.helper';

@Controller('certificates')
export class PublicCertificateController {
  constructor(private readonly certificateService: PublicCertificateService) {}

  @Get()
  findAll(@Query() query: any) {
    const { filters, options } = prepareQuery(query);
    return this.certificateService.getList(filters, options);
  }

  @Get('type/:type')
  findByType(@Param('type') type: CertificateType) {
    return this.certificateService.findByType(type);
  }
}

