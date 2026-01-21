import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ListActiveStaffUseCase } from '@/application/use-cases/introduction/staff/queries/public/list-active-staff.usecase';

@ApiTags('Public / Staff')
@Controller('staffs')
export class PublicStaffController {
  constructor(private readonly listActiveUseCase: ListActiveStaffUseCase) { }

  @ApiOperation({ summary: 'Get all active staff' })
  @Get()
  async findAll() {
    return this.listActiveUseCase.execute();
  }
}
