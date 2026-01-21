import { Module } from '@nestjs/common';
import { RbacModule } from '@/modules/core/rbac/rbac.module';

// Import admin modules
import { AdminContextModule } from '@/modules/core/context/admin/context/context.module';
import { AdminGroupModule } from '@/modules/core/context/admin/group/group.module';

// Import user modules
import { UserContextModule } from '@/modules/core/context/user/context/context.module';
import { UserGroupModule } from '@/modules/core/context/user/group/group.module';

// Import repository module
import { ContextRepositoryModule } from './context.repository.module';

import { RbacRepositoryModule } from '@/modules/core/rbac/rbac.repository.module';

@Module({
  imports: [
    RbacModule,
    ContextRepositoryModule,
    RbacRepositoryModule,
    // Admin modules
    AdminContextModule,
    AdminGroupModule,
    // User modules
    UserContextModule,
    UserGroupModule,
  ],
  exports: [ContextRepositoryModule, AdminContextModule, AdminGroupModule, UserContextModule, UserGroupModule],
})
export class ContextModule { }

