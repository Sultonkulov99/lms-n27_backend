import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Status, UserRoles } from "@prisma/client";
import { PrismaService } from "src/core/database/prisma.service";
import { UpdateStudentDto } from "./dto/update-student.dto";
import * as argon from "argon2";
import { CreateStudentDto } from "./dto/create-student.dto";

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllStudents(statusParam?: Status) {
    const status = statusParam || Status.ACTIVE;
    const students = await this.prisma.user.findMany({
      where: {
        role: UserRoles.STUDENT,
        status,
      },
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

  async createStudent(payload: CreateStudentDto, file?: Express.Multer.File) {
    const existingUser = await this.prisma.user.findFirst({
      where: { phone: payload.phone },
    });

    if (existingUser) {
      throw new ConflictException(
        "Bu telefon raqami allaqachon ro'yxatdan o'tgan",
      );
    }

    const hashedPassword = await argon.hash(payload.password);

    try {
      const newStudent = await this.prisma.user.create({
        data: {
          ...payload,
          password: hashedPassword,
          file: file?.filename,
          role: UserRoles.STUDENT,
        },
      });

      return { success: true, data: newStudent };
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new ConflictException("Bu telefon raqami allaqachon band");
      }
      throw error;
    }
  }

  async updateStudent(
    id: number,
    payload: UpdateStudentDto,
    file?: Express.Multer.File,
  ) {
    const ExistingStudent = await this.prisma.user.findFirst({ where: { id } });

    if (!ExistingStudent) {
      throw new NotFoundException("Student is not found");
    }

    const student = await this.prisma.user.findFirst({
      where: { role: UserRoles.STUDENT, phone: payload.phone, id: { not: id } },
    });

    if (student) throw new ConflictException("Student has already existed");

    const { file: _ignore, password, ...rest } = payload as any;
    const updatedStudent = await this.prisma.user.update({
      where: { id },
      data: {
        ...rest,
        ...(password && { password: await argon.hash(password) }),
        ...(file && { file: file.filename }),
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
        data: { status: "DELETED" },
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

  async archiveStudent(id: number) {
    const student = await this.prisma.user.findFirst({
      where: {
        id,
        role: UserRoles.STUDENT,
      },
    });

    if (!student) {
      throw new NotFoundException("Student is not found");
    }

    const updatedStudent = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        status: Status.INACTIVE,
      },
    });

    return {
      success: true,
      data: updatedStudent,
    };
  }

  async restoreStudent(id: number) {
    const student = await this.prisma.user.findFirst({
      where: {
        id,
        role: UserRoles.STUDENT,
      },
    });

    if (!student) {
      throw new NotFoundException("Student is not found");
    }

    const updatedStudent = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        status: Status.ACTIVE,
      },
    });

    return {
      success: true,
      data: updatedStudent,
    };
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
            user: {
              select: { id: true, fullName: true, file: true },
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
        user: payment.course.user
          ? {
              fullName: payment.course.user.fullName,
              file: payment.course.user.file,
            }
          : undefined,
        createdAt: payment.created_at.toISOString(),
        updatedAt: payment.created_at.toISOString(),
      },
      progress: 0,
      lastAccessedAt: payment.created_at.toISOString(),
    }));

    return myCourses;
  }
}
