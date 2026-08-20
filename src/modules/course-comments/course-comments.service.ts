import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CourseCommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(courseId: number, userId: number, text: string) {
    const course = await this.prisma.courses.findUnique({
      where: { id: courseId },
      include: { user: true }, // Include teacher info
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const comment = await this.prisma.courseComment.create({
      data: {
        text,
        courseId,
        userId,
      },
      include: {
        user: true,
      },
    });

    const userFullName = comment.user.fullName || 'Student';
    const message = `${userFullName} posted a comment on course: ${course.name}`;

    // Notify ALL Admins (recipientId = null)
    await this.notificationsService.create('New Course Comment', message, 'COURSE_COMMENT', undefined);

    // Notify the Teacher specifically
    if (course.teacherId) {
      await this.notificationsService.create('New Course Comment', message, 'COURSE_COMMENT', course.teacherId);
    }

    return comment;
  }

  async findByCourseId(courseId: number) {
    return this.prisma.courseComment.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            file: true,
          }
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }
}
