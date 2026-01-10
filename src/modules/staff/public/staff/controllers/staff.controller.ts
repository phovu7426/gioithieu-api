import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublicStaffService } from '@/modules/staff/public/staff/services/staff.service';
import { prepareQuery } from '@/common/base/utils/list-query.helper';

@Controller('staff')
export class PublicStaffController {
  constructor(private readonly staffService: PublicStaffService) {}

  @Get()
  findAll(@Query() query: any) {
    const { filters, options } = prepareQuery(query);
    return this.staffService.getList(filters, options);
  }

  @Get('department/:department')
  findByDepartment(@Param('department') department: string) {
    return this.staffService.findByDepartment(department);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffService.getOne({ id: BigInt(id) } as any);
  }
}

