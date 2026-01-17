import { Module } from '@nestjs/common';
import { PublicStaffService } from '@/modules/introduction/staff/public/services/staff.service';
import { PublicStaffController } from '@/modules/introduction/staff/public/controllers/staff.controller';

@Module({
  imports: [],
  controllers: [PublicStaffController],
  providers: [PublicStaffService],
  exports: [PublicStaffService],
})
export class PublicStaffModule { }

