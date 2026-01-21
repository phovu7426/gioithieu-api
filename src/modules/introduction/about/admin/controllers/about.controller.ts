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
import { CreateAboutSectionUseCase } from '@/application/use-cases/introduction/about/commands/create-section/create-section.usecase';
import { UpdateAboutSectionUseCase } from '@/application/use-cases/introduction/about/commands/update-section/update-section.usecase';
import { DeleteAboutSectionUseCase } from '@/application/use-cases/introduction/about/commands/delete-section/delete-section.usecase';
import { ListAboutSectionsUseCase } from '@/application/use-cases/introduction/about/queries/admin/list-sections.usecase';
import { GetAboutSectionUseCase } from '@/application/use-cases/introduction/about/queries/admin/get-section.usecase';
import { CreateAboutSectionDto } from '@/application/use-cases/introduction/about/commands/create-section/create-section.dto';
import { UpdateAboutSectionDto } from '@/application/use-cases/introduction/about/commands/update-section/update-section.dto';
import { LogRequest } from '@/common/decorators/log-request.decorator';
import { Permission } from '@/common/decorators/rbac.decorators';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RbacGuard } from '@/common/guards/rbac.guard';

@ApiTags('Admin / Introduction / About')
@Controller('admin/about-sections')
@UseGuards(JwtAuthGuard, RbacGuard)
export class AboutController {
  constructor(
    private readonly listUseCase: ListAboutSectionsUseCase,
    private readonly getUseCase: GetAboutSectionUseCase,
    private readonly createUseCase: CreateAboutSectionUseCase,
    private readonly updateUseCase: UpdateAboutSectionUseCase,
    private readonly deleteUseCase: DeleteAboutSectionUseCase,
  ) { }

  @LogRequest()
  @Post()
  @Permission('about.manage')
  @ApiOperation({ summary: 'Create new about section' })
  create(@Body(ValidationPipe) dto: CreateAboutSectionDto) {
    return this.createUseCase.execute(dto);
  }

  @Get()
  @Permission('about.manage')
  @ApiOperation({ summary: 'List all about sections' })
  findAll() {
    return this.listUseCase.execute();
  }

  @Get(':id')
  @Permission('about.manage')
  @ApiOperation({ summary: 'Get about section by ID' })
  findOne(@Param('id') id: string) {
    return this.getUseCase.execute(BigInt(id));
  }

  @Put(':id')
  @Permission('about.manage')
  @ApiOperation({ summary: 'Update about section' })
  update(@Param('id') id: string, @Body(ValidationPipe) dto: UpdateAboutSectionDto) {
    return this.updateUseCase.execute(BigInt(id), dto);
  }

  @Delete(':id')
  @Permission('about.manage')
  @ApiOperation({ summary: 'Delete about section' })
  remove(@Param('id') id: string) {
    return this.deleteUseCase.execute(BigInt(id));
  }
}

