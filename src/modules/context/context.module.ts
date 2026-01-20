import { Module } from '@nestjs/common';
import { RbacModule } from '@/modules/rbac/rbac.module';

// Import admin modules
import { AdminContextModule } from '@/modules/context/admin/context/context.module';
import { AdminGroupModule } from '@/modules/context/admin/group/group.module';

// Import user modules
import { UserContextModule } from '@/modules/context/user/context/context.module';
import { UserGroupModule } from '@/modules/context/user/group/group.module';

// Import repository module
import { ContextRepositoryModule } from './context.repository.module';

import { RbacRepositoryModule } from '@/modules/rbac/rbac.repository.module';

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

