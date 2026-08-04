import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateCourseAssistantDto } from './dto/create-course-assistant.dto';
import { UpdateCourseAssistantDto } from './dto/update-course-assistant.dto';

@Injectable()
export class CourseAssistantService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCourseAssistantDto) {
    return this.prisma.courseAssistant.create({
      data: dto,
      include: {
        user: true,
      },
    });
  }

  async findAll() {
    return this.prisma.courseAssistant.findMany({
      include: {
        user: true,
      },
    });
  }

  async findOne(id: number) {
    const assistant = await this.prisma.courseAssistant.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!assistant) {
      throw new NotFoundException('Course Assistant not found');
    }

    return assistant;
  }

  async update(id: number, dto: UpdateCourseAssistantDto) {
    await this.findOne(id);

    return this.prisma.courseAssistant.update({
      where: { id },
      data: dto,
      include: {
        user: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.courseAssistant.delete({
      where: { id },
    });
  }
}