import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UserRoles } from "@prisma/client";
import { PrismaService } from "src/core/database/prisma.service";
import { UpdateStudentDto } from "./dto/update-student.dto";

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllStudents() {
    const students = await this.prisma.user.findMany({
      where: { role: UserRoles.STUDENT },
      select: {
        id: true,
        file: true,
        fullName: true,
        phone: true,
        role: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });

    return {
      success: true,
      data: students,
    };
  }

  async getOneStudent(id: number) {
    const student = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        phone: true,
        role: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!student) {
      throw new NotFoundException("Bunaqa student yo'q. Yana bilmadim:)!");
    }
    return {
      success: true,
      data: student,
    };
  }

  async updateStudent(id: number, dto: UpdateStudentDto) {
    const ExistingStudent = await this.prisma.user.findFirst({ where: { id } });

    if (!ExistingStudent) {
      throw new NotFoundException("Student is not found");
    }

    const student = await this.prisma.user.findFirst({
      where: { role: UserRoles.ADMIN, phone: dto.phone },
    });

    if (student) throw new ConflictException("Student has already existed");

    const updatedStudent = await this.prisma.user.update({
      where: { id },
      data: {
        ...dto,
      },
    });

    return {
      success: true,
      data: updatedStudent,
    };
  }

  async deleteStudent(id: number) {
    const ExistingStudent = await this.prisma.user.findFirst({ where: { id } });

    if (!ExistingStudent) throw new NotFoundException("Student is not found");

    try {
      await this.prisma.user.update({
        where: { id },
        data: { status: "INACTIVE" },
      });

      return {
        success: true,
        message: "Student successfully deleted (soft delete)",
      };
    } catch (error: any) {
      console.error("Delete student error:", error);
      throw new Error(`Failed to delete student: ${error.message}`);
    }
  }

  async getMyCourses(userId: number) {
    const payments = await this.prisma.payments.findMany({
      where: {
        userId,
        status: true,
      },
      include: {
        course: {
          select: {
            id: true,
            banner: true,
            name: true,
            description: true,
            level: true,
            price: true,
            categories: {
              select: { id: true, name: true },
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    const myCourses = payments.map((payment) => ({
      course: {
        id: payment.course.id,
        title: payment.course.name,
        description: payment.course.description,
        thumbnail: payment.course.banner,
        categoryId: payment.course.categories?.id,
        category: {
          id: payment.course.categories?.id,
          name: payment.course.categories?.name,
        },
        createdAt: payment.created_at.toISOString(),
        updatedAt: payment.created_at.toISOString(),
      },
      progress: 0,
      lastAccessedAt: payment.created_at.toISOString(),
    }));

    return myCourses;
  }
}
