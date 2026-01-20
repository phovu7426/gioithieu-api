import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { INotificationRepository, NOTIFICATION_REPOSITORY, NotificationFilter } from '@/modules/extra/notification/repositories/notification.repository.interface';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepo: INotificationRepository,
  ) { }

  async getList(query: any) {
    const filter: NotificationFilter = {};
    if (query.search) filter.search = query.search;
    if (query.userId) filter.userId = query.userId;
    if (query.isRead !== undefined) filter.isRead = query.isRead;
    if (query.type) filter.type = query.type;
    if (query.status) filter.status = query.status;

    const result = await this.notificationRepo.findAll({
      page: query.page,
      limit: query.limit,
      sort: query.sort || 'created_at:desc',
      filter,
    });

    result.data = result.data.map(item => this.transform(item));
    return result;
  }

  async getSimpleList(query: any) {
    return this.getList({
      ...query,
      limit: query.limit ?? 50,
    });
  }

  async getOne(id: number) {
    const notification = await this.notificationRepo.findById(id);
    return this.transform(notification);
  }

  async create(data: any) {
    const payload = {
      ...data,
      user_id: data.user_id ? BigInt(data.user_id) : null,
    };
    const notification = await this.notificationRepo.create(payload);
    return this.getOne(Number(notification.id));
  }

  async update(id: number, data: any) {
    const payload = {
      ...data,
      user_id: data.user_id ? BigInt(data.user_id) : null,
    };
    await this.notificationRepo.update(id, payload);
    return this.getOne(id);
  }

  async delete(id: number) {
    return this.notificationRepo.delete(id);
  }

  async restore(id: number) {
    return this.notificationRepo.update(id, { deleted_at: null } as any);
  }

  async markAsReadForUser(id: number, userId: number) {
    const notification = await this.notificationRepo.findById(id);
    if (!notification || Number(notification.user_id) !== userId) {
      throw new NotFoundException('Notification not found');
    }
    const updated = await this.notificationRepo.markAsRead(id);
    return this.transform(updated);
  }

  async markAllAsReadForUser(userId: number) {
    await this.notificationRepo.markAllAsRead(userId);
  }

  private transform(notification: any) {
    if (!notification) return notification;
    const item = { ...notification };
    if (item.id) item.id = Number(item.id);
    if (item.user_id) item.user_id = Number(item.user_id);
    if (item.created_user_id) item.created_user_id = Number(item.created_user_id);
    if (item.updated_user_id) item.updated_user_id = Number(item.updated_user_id);
    return item;
  }
}
