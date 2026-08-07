import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { CreateHomeworkDto } from "./dto/create-homework.dto";
import { UpdateHomeworkDto } from "./dto/update-homework.dto";
import { PrismaService } from "src/core/database/prisma.service";

@Injectable()
export class HomeworksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateHomeworkDto, files?: Express.Multer.File[]) {
    const uploadedFiles = files?.map((file) => file.filename) || [];

    const homework = await this.prisma.homeworks.create({
      data: {
        lessonId: Number(dto.lessonId),
        description: dto.description,
        file: uploadedFiles,
      },
    });

    return {
      success: true,
      data: homework,
    };
  }

  async findAll() {
    const homeworks = await this.prisma.homeworks.findMany({
      include: {
        lessons: true,
      },
    });

    return {
      success: true,
      data: homeworks,
    };
  }

  async findOne(id: number) {
    const homework = await this.prisma.homeworks.findUnique({
      where: {
        id,
      },
      include: {
        lessons: true,
      },
    });

    if (!homework) {
      throw new NotFoundException("Homework not found");
    }

    return {
      succes: true,
      data: homework,
    };
  }

  async update(
    id: number,
    dto: UpdateHomeworkDto,
    files?: Express.Multer.File[],
  ) {
    await this.findOne(id);

    const uploadedFiles = files?.map((file) => file.filename);

    const updated = await this.prisma.homeworks.update({
      where: {
        id,
      },
      data: {
        lessonId: dto.lessonId,
        description: dto.description,
        ...(uploadedFiles && {
          file: uploadedFiles,
        }),
      },
    });

    return {
      success: true,
      data: updated,
    };
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.homeworks.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: `Homework (id:${id}) deleted successfully`,
    };
  }
}
