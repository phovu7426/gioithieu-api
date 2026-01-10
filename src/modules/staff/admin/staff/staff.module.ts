import { Module } from '@nestjs/common';
import { StaffService } from '@/modules/staff/admin/staff/services/staff.service';
import { StaffController } from '@/modules/staff/admin/staff/controllers/staff.controller';
import { RbacModule } from '@/modules/rbac/rbac.module';

@Module({
  imports: [
    RbacModule,
  ],
  controllers: [StaffController],
  providers: [StaffService],
  exports: [StaffService],
})
export class AdminStaffModule { }

