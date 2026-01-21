import { Controller, Get, Param, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetPublicCertificateUseCase } from '@/application/use-cases/certificate/queries/public/get-certificate/get-public-certificate.usecase';
import { ListPublicCertificatesUseCase } from '@/application/use-cases/certificate/queries/public/list-certificates/list-public-certificates.usecase';
import { PublicCertificateResponseDto } from '@/application/use-cases/certificate/queries/public/get-certificate/public-certificate.response.dto';

@ApiTags('Public Certificates')
@Controller('public/certificates')
export class PublicCertificateController {
  constructor(
    private readonly getUseCase: GetPublicCertificateUseCase,
    private readonly listUseCase: ListPublicCertificatesUseCase,
  ) { }

  @Get()
  @ApiOperation({ summary: 'List all active certificates for public view' })
  @ApiResponse({ status: HttpStatus.OK, type: [PublicCertificateResponseDto] })
  async getList() {
    return this.listUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get active certificate by ID for public view' })
  @ApiResponse({ status: HttpStatus.OK, type: PublicCertificateResponseDto })
  async getById(@Param('id') id: string) {
    return this.getUseCase.execute(BigInt(id));
  }
}
