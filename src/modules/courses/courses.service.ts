import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

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

    async create(dto: CreateCourseDto) {
        const category = await this.prisma.categories.findUnique({
            where: { id: dto.categoryId },
        });

        if (!category) throw new NotFoundException(`Kategoriya topilmadi (id: ${dto.categoryId})`);

        return this.prisma.courses.create({
            data: dto,
            include: { categories: true },
        });
    }


    async update(id: number, dto: UpdateCourseDto) {
    await this.findOne(id);

    if (dto.categoryId) {
        const category = await this.prisma.categories.findUnique({
            where: { id: dto.categoryId },
        });
        if (!category) {
            throw new NotFoundException(`Kategoriya topilmadi (id: ${dto.categoryId})`);
        }
    }

    return this.prisma.courses.update({
        where: { id },
        data: dto,
        include: { categories: true },
    });
}



async remove(id: number) {
    await this.findOne(id);

    try {
        return await this.prisma.courses.delete({
            where: { id },
        });
    } catch (error) {
        throw new ConflictException(
            "Bu kursni o'chirish mumkin emas, unga bog'liq ma'lumotlar mavjud"
        );
    }
}


}
