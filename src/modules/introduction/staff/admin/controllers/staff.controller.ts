import { Controller, Get, Post, Put, Delete, Body, Param, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateStaffUseCase } from '@/application/use-cases/introduction/staff/commands/create-staff/create-staff.usecase';
import { UpdateStaffUseCase } from '@/application/use-cases/introduction/staff/commands/update-staff/update-staff.usecase';
import { DeleteStaffUseCase } from '@/application/use-cases/introduction/staff/commands/delete-staff/delete-staff.usecase';
import { ListStaffUseCase } from '@/application/use-cases/introduction/staff/queries/admin/list-staff.usecase';
import { GetStaffUseCase } from '@/application/use-cases/introduction/staff/queries/admin/get-staff.usecase';
import { CreateStaffDto } from '@/application/use-cases/introduction/staff/commands/create-staff/create-staff.dto';
import { UpdateStaffDto } from '@/application/use-cases/introduction/staff/commands/update-staff/update-staff.dto';
import { Permission } from '@/common/decorators/rbac.decorators';

@ApiTags('Admin / Introduction / Staff')
@Controller('admin/staffs')
export class AdminStaffController {
  constructor(
    private readonly listUseCase: ListStaffUseCase,
    private readonly getUseCase: GetStaffUseCase,
    private readonly createUseCase: CreateStaffUseCase,
    private readonly updateUseCase: UpdateStaffUseCase,
    private readonly deleteUseCase: DeleteStaffUseCase,
  ) { }

  @ApiOperation({ summary: 'List all staff members' })
  @Permission('staff.view')
  @Get()
  async findAll() {
    return this.listUseCase.execute();
  }

  @ApiOperation({ summary: 'Get staff member by ID' })
  @Permission('staff.view')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.getUseCase.execute(BigInt(id));
  }

  @ApiOperation({ summary: 'Create new staff member' })
  @Permission('staff.manage')
  @Post()
  async create(@Body(ValidationPipe) dto: CreateStaffDto) {
    return this.createUseCase.execute(dto);
  }

  @ApiOperation({ summary: 'Update staff member' })
  @Permission('staff.manage')
  @Put(':id')
  async update(@Param('id') id: string, @Body(ValidationPipe) dto: UpdateStaffDto) {
    return this.updateUseCase.execute(BigInt(id), dto);
  }

  @ApiOperation({ summary: 'Delete staff member' })
  @Permission('staff.manage')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.deleteUseCase.execute(BigInt(id));
  }
}
