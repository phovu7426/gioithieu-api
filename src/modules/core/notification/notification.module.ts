import { Module } from '@nestjs/common';
import { NotificationService } from '@/modules/core/notification/admin/services/notification.service';
import { NotificationController as AdminNotificationController } from '@/modules/core/notification/admin/controllers/notification.controller';
import { NotificationController as UserNotificationController } from '@/modules/core/notification/user/controllers/notification.controller';
import { RbacModule } from '@/modules/core/rbac/rbac.module';

// Import repository module
<<<<<<< HEAD:src/modules/core/notification/notification.module.ts
import { NotificationRepositoryModule } from '@/modules/core/notification/notification.repository.module';
=======
import { NotificationRepositoryModule } from './notification.repository.module';
>>>>>>> parent of cf58bf3 (fix repo):src/modules/extra/notification/notification.module.ts

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