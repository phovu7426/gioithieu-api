import { Module } from '@nestjs/common';
import { RoleService } from '@/modules/common/user-management/admin/role/services/role.service';
import { RoleController } from '@/modules/common/user-management/admin/role/controllers/role.controller';
import { RbacModule } from '@/modules/rbac/rbac.module';

import { RbacRepositoryModule } from '@/modules/rbac/rbac.repository.module';

@Module({
  imports: [
    RbacModule,
    RbacRepositoryModule,
  ],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleService],
})
export class AdminRoleModule { }




