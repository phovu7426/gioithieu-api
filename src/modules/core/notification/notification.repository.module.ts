
import { Module } from '@nestjs/common';
import { NOTIFICATION_REPOSITORY } from './repositories/notification.repository.interface';
import { NotificationPrismaRepository } from './repositories/notification.prisma.repository';

@Module({
    providers: [
        {
            provide: NOTIFICATION_REPOSITORY,
            useClass: NotificationPrismaRepository,
        },
    ],
    exports: [NOTIFICATION_REPOSITORY],
})
export class NotificationRepositoryModule { }
