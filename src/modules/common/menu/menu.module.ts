import { Module } from '@nestjs/common';
import { AdminMenuModule } from '@/modules/common/menu/admin/menu.module';
import { UserMenuModule } from '@/modules/common/menu/user/menu.module';

@Module({
  imports: [
    AdminMenuModule,
    UserMenuModule,
  ],
})
export class MenuModule {}

