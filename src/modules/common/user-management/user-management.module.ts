import { Module } from '@nestjs/common';
// Import shared services
import { UserService } from '@/modules/common/user-management/user/user/services/user.service';

// Import admin modules
import { AdminUserModule } from '@/modules/common/user-management/admin/user/user.module';
import { AdminRoleModule } from '@/modules/common/user-management/admin/role/role.module';
import { AdminPermissionModule } from '@/modules/common/user-management/admin/permission/permission.module';

// Import user modules
import { UserUserModule } from '@/modules/common/user-management/user/user/user.module';
import { UserRepositoryModule } from './user.repository.module';

@Module({
  imports: [
    // Admin modules
    AdminUserModule,
    AdminRoleModule,
    AdminPermissionModule,
    // User modules
    UserUserModule,
    UserRepositoryModule,
  ],
  providers: [
    // Shared services
    UserService,
  ],
  exports: [
    // Export shared services for other modules to use
    UserService,
  ],
})
export class UserManagementModule { }