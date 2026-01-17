import { Module } from '@nestjs/common';

// Import admin modules
import { AdminStaffModule } from '@/modules/introduction/staff/admin/staff.module';

// Import public modules
import { PublicStaffModule } from '@/modules/introduction/staff/public/staff.module';

@Module({
  imports: [
    // Admin modules
    AdminStaffModule,
    // Public modules
    PublicStaffModule,
  ],
  exports: [],
})
export class StaffModule {}

