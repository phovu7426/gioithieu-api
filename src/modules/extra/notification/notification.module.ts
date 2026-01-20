import { Module } from '@nestjs/common';
import { NotificationService } from '@/modules/extra/notification/admin/services/notification.service';
import { NotificationController as AdminNotificationController } from '@/modules/extra/notification/admin/controllers/notification.controller';
import { NotificationController as UserNotificationController } from '@/modules/extra/notification/user/controllers/notification.controller';
import { RbacModule } from '@/modules/rbac/rbac.module';

// Import repository module
import { NotificationRepositoryModule } from './notification.repository.module';

@Module({
  imports: [
    RbacModule,
    NotificationRepositoryModule,
  ],
  controllers: [AdminNotificationController, UserNotificationController],
  providers: [NotificationService],
  exports: [NotificationService, NotificationRepositoryModule],
})
export class NotificationModule { }