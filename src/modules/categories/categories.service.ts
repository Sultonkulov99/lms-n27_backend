import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    return this.prisma.categories.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.categories.findMany({
      include: {
        courses: true,
      },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.categories.findUnique({
      where: { id },
      include: {
        courses: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.findOne(id);

    return this.prisma.categories.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.categories.delete({
      where: { id },
    });
  }
}