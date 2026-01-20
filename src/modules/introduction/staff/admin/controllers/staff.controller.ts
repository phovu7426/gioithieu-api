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
import { StaffService } from '@/modules/introduction/staff/admin/services/staff.service';
import { CreateStaffDto } from '@/modules/introduction/staff/admin/dtos/create-staff.dto';
import { UpdateStaffDto } from '@/modules/introduction/staff/admin/dtos/update-staff.dto';
import { prepareQuery } from '@/common/base/utils/list-query.helper';
import { LogRequest } from '@/common/decorators/log-request.decorator';
import { Permission } from '@/common/decorators/rbac.decorators';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RbacGuard } from '@/common/guards/rbac.guard';

@Controller('admin/staff')
@UseGuards(JwtAuthGuard, RbacGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) { }

  @LogRequest()
  @Post()
  @Permission('staff.manage')
  create(@Body(ValidationPipe) createStaffDto: CreateStaffDto) {
    return this.staffService.create(createStaffDto);
  }

  @Get()
  @Permission('staff.manage')
  findAll(@Query(ValidationPipe) query: any) {
    return this.staffService.getList(query);
  }

  @Get(':id')
  @Permission('staff.manage')
  findOne(@Param('id') id: string) {
    return this.staffService.getOne(+id);
  }

  @Put(':id')
  @Permission('staff.manage')
  update(@Param('id') id: string, @Body(ValidationPipe) updateStaffDto: UpdateStaffDto) {
    return this.staffService.update(+id, updateStaffDto);
  }

  @Delete(':id')
  @Permission('staff.manage')
  remove(@Param('id') id: string) {
    return this.staffService.delete(+id);
  }
}

