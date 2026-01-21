
import { Injectable } from '@nestjs/common';
import { Notification, Prisma } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma/prisma.service';
import { PrismaRepository } from '@/common/core/repositories';
import { INotificationRepository, NotificationFilter } from './notification.repository.interface';

@Injectable()
export class NotificationPrismaRepository extends PrismaRepository<
    Notification,
    Prisma.NotificationWhereInput,
    Prisma.NotificationCreateInput,
    Prisma.NotificationUpdateInput,
    Prisma.NotificationOrderByWithRelationInput
> implements INotificationRepository {
    constructor(private readonly prisma: PrismaService) {
        super(prisma.notification as unknown as any, 'created_at:desc');
    }

    protected buildWhere(filter: NotificationFilter): Prisma.NotificationWhereInput {
        const where: Prisma.NotificationWhereInput = {};

        if (filter.search) {
            where.OR = [
                { title: { contains: filter.search } },
                { message: { contains: filter.search } },
            ];
        }

        if (filter.userId) {
            where.user_id = BigInt(filter.userId);
        }

        if (filter.isRead !== undefined) {
            where.is_read = filter.isRead;
        }

        if (filter.type) {
            where.type = filter.type as any;
        }

        if (filter.status) {
            where.status = filter.status as any;
        }

        where.deleted_at = null;

        return where;
    }

    async markAsRead(id: number): Promise<Notification> {
        return this.prisma.notification.update({
            where: { id: BigInt(id) },
            data: {
                is_read: true,
                read_at: new Date(),
            },
        });
    }

    async markAllAsRead(userId: number): Promise<void> {
        await this.prisma.notification.updateMany({
            where: {
                user_id: BigInt(userId),
                is_read: false,
                deleted_at: null,
            },
            data: {
                is_read: true,
                read_at: new Date(),
            },
        });
    }
}
