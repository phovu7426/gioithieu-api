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
import { CreateFaqUseCase } from '@/application/use-cases/introduction/faq/commands/create-faq/create-faq.usecase';
import { UpdateFaqUseCase } from '@/application/use-cases/introduction/faq/commands/update-faq/update-faq.usecase';
import { DeleteFaqUseCase } from '@/application/use-cases/introduction/faq/commands/delete-faq/delete-faq.usecase';
import { ListFaqsUseCase } from '@/application/use-cases/introduction/faq/queries/admin/list-faqs.usecase';
import { GetFaqUseCase } from '@/application/use-cases/introduction/faq/queries/admin/get-faq.usecase';
import { CreateFaqDto } from '@/application/use-cases/introduction/faq/commands/create-faq/create-faq.dto';
import { UpdateFaqDto } from '@/application/use-cases/introduction/faq/commands/update-faq/update-faq.dto';
import { LogRequest } from '@/common/decorators/log-request.decorator';
import { Permission } from '@/common/decorators/rbac.decorators';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RbacGuard } from '@/common/guards/rbac.guard';

@ApiTags('Admin / Introduction / FAQ')
@Controller('admin/faqs')
@UseGuards(JwtAuthGuard, RbacGuard)
export class FaqController {
  constructor(
    private readonly listUseCase: ListFaqsUseCase,
    private readonly getUseCase: GetFaqUseCase,
    private readonly createUseCase: CreateFaqUseCase,
    private readonly updateUseCase: UpdateFaqUseCase,
    private readonly deleteUseCase: DeleteFaqUseCase,
  ) { }

  @LogRequest()
  @Post()
  @Permission('faq.manage')
  @ApiOperation({ summary: 'Create new FAQ' })
  create(@Body(ValidationPipe) dto: CreateFaqDto) {
    return this.createUseCase.execute(dto);
  }

  @Get()
  @Permission('faq.manage')
  @ApiOperation({ summary: 'List all FAQs' })
  findAll() {
    return this.listUseCase.execute();
  }

  @Get(':id')
  @Permission('faq.manage')
  @ApiOperation({ summary: 'Get FAQ by ID' })
  findOne(@Param('id') id: string) {
    return this.getUseCase.execute(BigInt(id));
  }

  @Put(':id')
  @Permission('faq.manage')
  @ApiOperation({ summary: 'Update FAQ' })
  update(@Param('id') id: string, @Body(ValidationPipe) dto: UpdateFaqDto) {
    return this.updateUseCase.execute(BigInt(id), dto);
  }

  @Delete(':id')
  @Permission('faq.manage')
  @ApiOperation({ summary: 'Delete FAQ' })
  remove(@Param('id') id: string) {
    return this.deleteUseCase.execute(BigInt(id));
  }
}

