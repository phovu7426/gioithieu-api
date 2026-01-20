import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RbacGuard } from '@/common/guards/rbac.guard';
import { Permission } from '@/common/decorators/rbac.decorators';
import { NotificationService } from '@/modules/extra/notification/admin/services/notification.service';
import { GetNotificationsDto } from '@/modules/extra/notification/user/dtos/get-notifications.dto';
import { AuthUser } from '@/common/interfaces/auth-user.interface';
import { prepareQuery } from '@/common/base/utils/list-query.helper';
import { LogRequest } from '@/common/decorators/log-request.decorator';
import { BasicStatus } from '@/shared/enums/types/basic-status.enum';

@Controller('user/notifications')
@UseGuards(JwtAuthGuard, RbacGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Get()
  @Permission('notification.manage')
  async getList(
    @Request() req: { user: AuthUser },
    @Query() query: GetNotificationsDto,
  ) {
    return this.notificationService.getList({ ...query, userId: req.user.id });
  }

  @Get('unread')
  @Permission('notification.manage')
  async getUnread(@Request() req: { user: AuthUser }) {
    return this.notificationService.getList({ isRead: false, userId: req.user.id });
  }

  @Get('unread/count')
  @Permission('notification.manage')
  async getUnreadCount(@Request() req: { user: AuthUser }) {
    const result = await this.notificationService.getList(
      { userId: req.user.id, isRead: false, status: BasicStatus.active, page: 1, limit: 1 },
    );
    return { success: true, data: { count: result.meta?.totalItems || 0 }, message: 'Unread count retrieved successfully' };
  }

  @Get(':id')
  @Permission('notification.manage')
  async getOne(
    @Param('id') id: string,
    @Request() req: { user: AuthUser },
  ) {
    // Current getOne only takes ID, we should ensure user owns it.
    const notification = await this.notificationService.getOne(+id);
    if (!notification || notification.user_id !== req.user.id) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  @LogRequest()
  @Patch(':id/read')
  @Permission('notification.manage')
  async markAsRead(
    @Param('id') id: string,
    @Request() req: { user: AuthUser },
  ) {
    return this.notificationService.markAsReadForUser(+id, req.user.id);
  }

  @LogRequest()
  @Patch('read-all')
  @Permission('notification.manage')
  async markAllAsRead(@Request() req: { user: AuthUser }) {
    return this.notificationService.markAllAsReadForUser(req.user.id);
  }
}