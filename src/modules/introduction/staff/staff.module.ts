import { Module } from '@nestjs/common';
import { AdminStaffModule } from './admin/staff.module';
// Public sub-module can be added here later

@Module({
  imports: [AdminStaffModule],
  exports: [AdminStaffModule],
})
export class StaffModule { }
