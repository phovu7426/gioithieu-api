import { Module } from '@nestjs/common';
import { StaffService } from '@/modules/introduction/staff/admin/services/staff.service';
import { StaffController } from '@/modules/introduction/staff/admin/controllers/staff.controller';
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

