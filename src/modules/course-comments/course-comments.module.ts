import { Module } from '@nestjs/common';
import { CourseCommentsService } from './course-comments.service';
import { CourseCommentsController } from './course-comments.controller';
import { PrismaModule } from '../../core/database/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [CourseCommentsController],
  providers: [CourseCommentsService],
})
export class CourseCommentsModule {}
