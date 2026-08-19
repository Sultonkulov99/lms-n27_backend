import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private gateway: NotificationsGateway,
  ) {}

  async create(title: string, message: string, type: string = 'COMMENT') {
    const notification = await this.prisma.notification.create({
      data: {
        title,
        message,
        type,
      },
    });
    
    // Emit via WebSocket
    this.gateway.emitNewNotification(notification);
    
    return notification;
  }

  async findAllUnread() {
    return this.prisma.notification.findMany({
      where: { isRead: false },
      orderBy: { created_at: 'desc' },
    });
  }

  async markAsRead(id: number) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }
}
