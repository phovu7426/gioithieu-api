import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublicStaffService } from '@/modules/staff/public/staff/services/staff.service';
import { prepareQuery } from '@/common/base/utils/list-query.helper';
import { Permission } from '@/common/decorators/rbac.decorators';

@Controller('staff')
export class PublicStaffController {
  constructor(private readonly staffService: PublicStaffService) {}

  @Permission('public')
  @Get()
  findAll(@Query() query: any) {
    const { filters, options } = prepareQuery(query);
    return this.staffService.getList(filters, options);
  }

  @Permission('public')
  @Get('department/:department')
  findByDepartment(@Param('department') department: string) {
    return this.staffService.findByDepartment(department);
  }

  @Permission('public')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffService.getOne({ id: BigInt(id) } as any);
  }
}

