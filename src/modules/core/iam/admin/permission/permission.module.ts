import { Module } from '@nestjs/common';
import { PermissionService } from '@/modules/core/iam/admin/permission/services/permission.service';
import { PermissionController } from '@/modules/core/iam/admin/permission/controllers/permission.controller';
import { RbacModule } from '@/modules/core/rbac/rbac.module';

@Module({
  imports: [
    RbacModule,
  ],
  providers: [PermissionService],
  controllers: [PermissionController],
  exports: [PermissionService],
})
export class AdminPermissionModule { }




