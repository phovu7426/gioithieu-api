import { Module } from '@nestjs/common';
// Import shared services
import { UserService } from '@/modules/core/iam/user/user/services/user.service';

// Import admin modules
import { AdminUserModule } from '@/modules/core/iam/admin/user/user.module';
import { AdminRoleModule } from '@/modules/core/iam/admin/role/role.module';
import { AdminPermissionModule } from '@/modules/core/iam/admin/permission/permission.module';

// Import user modules
import { UserUserModule } from '@/modules/core/iam/user/user/user.module';
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