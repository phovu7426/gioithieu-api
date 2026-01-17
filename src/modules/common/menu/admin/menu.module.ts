import { Module } from '@nestjs/common';
import { MenuService } from '@/modules/common/menu/admin/services/menu.service';
import { AdminMenuController } from '@/modules/common/menu/admin/controllers/menu.controller';
import { RbacModule } from '@/modules/rbac/rbac.module';

@Module({
  imports: [
    RbacModule,
  ],
  controllers: [AdminMenuController],
  providers: [MenuService],
  exports: [MenuService, RbacModule],
})
export class AdminMenuModule {}

