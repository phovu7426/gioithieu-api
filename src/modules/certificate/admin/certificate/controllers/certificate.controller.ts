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
import { CertificateService } from '@/modules/certificate/admin/certificate/services/certificate.service';
import { CreateCertificateDto } from '@/modules/certificate/admin/certificate/dtos/create-certificate.dto';
import { UpdateCertificateDto } from '@/modules/certificate/admin/certificate/dtos/update-certificate.dto';
import { prepareQuery } from '@/common/base/utils/list-query.helper';
import { LogRequest } from '@/common/decorators/log-request.decorator';
import { Permission } from '@/common/decorators/rbac.decorators';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RbacGuard } from '@/common/guards/rbac.guard';

@Controller('admin/certificates')
@UseGuards(JwtAuthGuard, RbacGuard)
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @LogRequest()
  @Post()
  @Permission('certificate.manage')
  create(@Body(ValidationPipe) createCertificateDto: CreateCertificateDto) {
    return this.certificateService.create(createCertificateDto);
  }

  @Get()
  @Permission('certificate.manage')
  findAll(@Query(ValidationPipe) query: any) {
    const { filters, options } = prepareQuery(query);
    return this.certificateService.getList(filters, options);
  }

  @Get(':id')
  @Permission('certificate.manage')
  findOne(@Param('id') id: string) {
    return this.certificateService.getOne({ id: BigInt(id) } as any);
  }

  @Put(':id')
  @Permission('certificate.manage')
  update(@Param('id') id: string, @Body(ValidationPipe) updateCertificateDto: UpdateCertificateDto) {
    return this.certificateService.update({ id: BigInt(id) } as any, updateCertificateDto);
  }

  @Delete(':id')
  @Permission('certificate.manage')
  remove(@Param('id') id: string) {
    return this.certificateService.delete({ id: BigInt(id) } as any);
  }
}

