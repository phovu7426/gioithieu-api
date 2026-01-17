import { Module } from '@nestjs/common';
import { UserMenuController } from '@/modules/common/menu/user/controllers/menu.controller';
import { AdminMenuModule } from '@/modules/common/menu/admin/menu.module';
import { RbacModule } from '@/modules/rbac/rbac.module';

@Module({
  imports: [
    RbacModule,
    AdminMenuModule,
  ],
  controllers: [UserMenuController],
})
export class UserMenuModule {}
