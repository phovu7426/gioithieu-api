import { Module } from '@nestjs/common';
import { PublicStaffService } from '@/modules/staff/public/staff/services/staff.service';
import { PublicStaffController } from '@/modules/staff/public/staff/controllers/staff.controller';

@Module({
  imports: [],
  controllers: [PublicStaffController],
  providers: [PublicStaffService],
  exports: [PublicStaffService],
})
export class PublicStaffModule { }

