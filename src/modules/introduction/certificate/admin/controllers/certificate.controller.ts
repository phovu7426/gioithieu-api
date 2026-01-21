import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCertificateUseCase } from '@/application/use-cases/certificate/commands/create-certificate/create-certificate.usecase';
import { UpdateCertificateUseCase } from '@/application/use-cases/certificate/commands/update-certificate/update-certificate.usecase';
import { DeleteCertificateUseCase } from '@/application/use-cases/certificate/commands/delete-certificate/delete-certificate.usecase';
import { GetCertificateUseCase } from '@/application/use-cases/certificate/queries/admin/get-certificate/get-certificate.usecase';
import { ListCertificatesUseCase } from '@/application/use-cases/certificate/queries/admin/list-certificates/list-certificates.usecase';
import { CreateCertificateDto } from '@/application/use-cases/certificate/commands/create-certificate/create-certificate.dto';
import { UpdateCertificateDto } from '@/application/use-cases/certificate/commands/update-certificate/update-certificate.dto';
import { ListCertificatesQuery } from '@/application/use-cases/certificate/queries/admin/list-certificates/list-certificates.query';
import { AdminCertificateResponseDto } from '@/application/use-cases/certificate/queries/admin/get-certificate/admin-certificate.response.dto';

@ApiTags('Admin Certificates')
@Controller('admin/certificates')
export class AdminCertificateController {
  constructor(
    private readonly createUseCase: CreateCertificateUseCase,
    private readonly updateUseCase: UpdateCertificateUseCase,
    private readonly deleteUseCase: DeleteCertificateUseCase,
    private readonly getUseCase: GetCertificateUseCase,
    private readonly listUseCase: ListCertificatesUseCase,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a new certificate' })
  @ApiResponse({ status: HttpStatus.CREATED, type: AdminCertificateResponseDto })
  async create(@Body() dto: CreateCertificateDto) {
    return this.createUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List certificates with pagination and filters' })
  @ApiResponse({ status: HttpStatus.OK, type: [AdminCertificateResponseDto] })
  async getList(@Query() query: ListCertificatesQuery) {
    return this.listUseCase.execute(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get certificate by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: AdminCertificateResponseDto })
  async getById(@Param('id') id: string) {
    return this.getUseCase.execute(BigInt(id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update certificate by ID' })
  @ApiResponse({ status: HttpStatus.OK, type: AdminCertificateResponseDto })
  async update(@Param('id') id: string, @Body() dto: UpdateCertificateDto) {
    return this.updateUseCase.execute(BigInt(id), dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete certificate by ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  async delete(@Param('id') id: string) {
    await this.deleteUseCase.execute(BigInt(id));
  }
}
