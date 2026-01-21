import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreatePartnerUseCase } from '@/application/use-cases/introduction/partner/commands/create-partner/create-partner.usecase';
import { UpdatePartnerUseCase } from '@/application/use-cases/introduction/partner/commands/update-partner/update-partner.usecase';
import { DeletePartnerUseCase } from '@/application/use-cases/introduction/partner/commands/delete-partner/delete-partner.usecase';
import { ListPartnersUseCase } from '@/application/use-cases/introduction/partner/queries/admin/list-partners.usecase';
import { GetPartnerUseCase } from '@/application/use-cases/introduction/partner/queries/admin/get-partner.usecase';
import { CreatePartnerDto } from '@/application/use-cases/introduction/partner/commands/create-partner/create-partner.dto';
import { UpdatePartnerDto } from '@/application/use-cases/introduction/partner/commands/update-partner/update-partner.dto';
import { LogRequest } from '@/common/decorators/log-request.decorator';
import { Permission } from '@/common/decorators/rbac.decorators';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RbacGuard } from '@/common/guards/rbac.guard';

@ApiTags('Admin / Introduction / Partner')
@Controller('admin/partners')
@UseGuards(JwtAuthGuard, RbacGuard)
export class PartnerController {
  constructor(
    private readonly listUseCase: ListPartnersUseCase,
    private readonly getUseCase: GetPartnerUseCase,
    private readonly createUseCase: CreatePartnerUseCase,
    private readonly updateUseCase: UpdatePartnerUseCase,
    private readonly deleteUseCase: DeletePartnerUseCase,
  ) { }

  @LogRequest()
  @Post()
  @Permission('partner.manage')
  @ApiOperation({ summary: 'Create new partner' })
  create(@Body(ValidationPipe) dto: CreatePartnerDto) {
    return this.createUseCase.execute(dto);
  }

  @Get()
  @Permission('partner.manage')
  @ApiOperation({ summary: 'List all partners' })
  findAll() {
    return this.listUseCase.execute();
  }

  @Get(':id')
  @Permission('partner.manage')
  @ApiOperation({ summary: 'Get partner by ID' })
  findOne(@Param('id') id: string) {
    return this.getUseCase.execute(BigInt(id));
  }

  @Put(':id')
  @Permission('partner.manage')
  @ApiOperation({ summary: 'Update partner' })
  update(@Param('id') id: string, @Body(ValidationPipe) dto: UpdatePartnerDto) {
    return this.updateUseCase.execute(BigInt(id), dto);
  }

  @Delete(':id')
  @Permission('partner.manage')
  @ApiOperation({ summary: 'Delete partner' })
  remove(@Param('id') id: string) {
    return this.deleteUseCase.execute(BigInt(id));
  }
}

