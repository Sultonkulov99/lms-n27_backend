import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import * as fs from "fs/promises";
import { CourseFiles } from "./courses.controller";

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(page = 1, limit = 10) {
    return this.prisma.courses.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: { categories: true },
      orderBy: { created_at: "desc" },
    });
  }

  async findOne(id: number) {
    const course = await this.prisma.courses.findUnique({
      where: { id },
      include: { categories: true, sections: true },
    });

    if (!course) throw new NotFoundException(`Kurs topilmadi (id: ${id})`);

    return course;
  }

  async create(dto: CreateCourseDto, files: CourseFiles) {
    const bannerFile = files.banner?.[0];
    const introVideoFile = files.introVideo?.[0];

    if (!bannerFile) {
      throw new BadRequestException("Banner file is required");
    }

    try {
      const category = await this.prisma.categories.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(
          `Kategoriya topilmadi (id: ${dto.categoryId})`,
        );
      }

      const { banner, introVideo, ...rest } = dto;

      return await this.prisma.courses.create({
        data: {
          ...rest,
          // Multer path o'rniga to'g'ri web URL formatida saqlaymiz:
          banner: `/uploads/banners/${bannerFile.filename}`,
          introVideo: introVideoFile
            ? `/uploads/videos/${introVideoFile.filename}`
            : null,
        },
        include: { categories: true },
      });
    } catch (error) {
      await this.deleteUploadedFiles([bannerFile, introVideoFile]);
      throw error;
    }
  }

  async update(id: number, dto: UpdateCourseDto, files: CourseFiles) {
    const existing = await this.findOne(id);
    const bannerFile = files?.banner?.[0];
    const introVideoFile = files?.introVideo?.[0];

    try {
      if (dto.categoryId) {
        const category = await this.prisma.categories.findUnique({
          where: { id: dto.categoryId },
        });
        if (!category) {
          throw new NotFoundException(
            `Category not found (id: ${dto.categoryId})`,
          );
        }
      }

      const { banner, introVideo, ...rest } = dto;

      const updated = await this.prisma.courses.update({
        where: { id },
        data: {
          ...rest,
          ...(bannerFile && {
            banner: `/uploads/banners/${bannerFile.filename}`,
          }),
          ...(introVideoFile && {
            introVideo: `/uploads/videos/${introVideoFile.filename}`,
          }),
        },
        include: { categories: true },
      });

      // Yangi fayl kelganda eski fayllarni diskdan tozalash
      const oldPaths: string[] = [];
      if (bannerFile && existing.banner) {
        oldPaths.push(`.${existing.banner}`); // Masalan: ./uploads/banners/filename.png
      }
      if (introVideoFile && existing.introVideo) {
        oldPaths.push(`.${existing.introVideo}`);
      }
      if (oldPaths.length) {
        await this.deleteFilesByPath(oldPaths);
      }

      return updated;
    } catch (error) {
      await this.deleteUploadedFiles([bannerFile, introVideoFile]);
      throw error;
    }
  }

  async remove(id: number) {
    const existing = await this.findOne(id);

    try {
      return await this.prisma.courses.delete({
        where: { id },
      });
    } catch (error) {
      throw new ConflictException(
        "Bu kursni o'chirish mumkin emas, unga bog'liq ma'lumotlar mavjud",
      );
    }
  }

  private async deleteUploadedFiles(
    files: (Express.Multer.File | undefined)[],
  ) {
    await Promise.all(
      files
        .filter((f): f is Express.Multer.File => !!f?.path)
        .map((f) =>
          fs
            .unlink(f.path)
            .catch((err) =>
              console.error(`Faylni o'chirib bo'lmadi: ${f.path}`, err.message),
            ),
        ),
    );
  }
  private async deleteFilesByPath(paths: string[]) {
    await Promise.all(
      paths.map((filePath) =>
        fs
          .unlink(filePath)
          .catch((err) =>
            console.error(
              `Eski faylni o'chirib bo'lmadi: ${filePath}`,
              err.message,
            ),
          ),
      ),
    );
  }
}
