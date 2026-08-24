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
      where: { 
        role: UserRoles.STUDENT,
        status: { not: 'DELETED' }
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
        user: payment.course.user ? {
          fullName: payment.course.user.fullName,
          file: payment.course.user.file
        } : undefined,
        createdAt: payment.created_at.toISOString(),
        updatedAt: payment.created_at.toISOString(),
      },
      progress: 0,
      lastAccessedAt: payment.created_at.toISOString(),
    }));

    return myCourses;
  }

  async getStudentCourseDetails(courseId: number, userId: number) {
    const payment = await this.prisma.payments.findFirst({
      where: {
        userId,
        courseId,
        status: true,
      }
    });

    // We allow access if they have a payment OR if they are an admin testing the endpoint (handled by RolesGuard but we check role just in case, wait, userId alone doesn't give us role here, let's just bypass payment check for now if we want, or keep it strict. I will keep it strict, but since the frontend might send an admin token, let's just check payment). 
    // Wait, let's just query the user role.
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!payment && user?.role === UserRoles.STUDENT) {
      throw new ConflictException("Siz ushbu kursni sotib olmagansiz!");
    }

    const course = await this.prisma.courses.findUnique({
      where: { id: courseId },
      include: {
        categories: { select: { id: true, name: true } },
        user: { select: { id: true, fullName: true, file: true } },
        sections: {
          include: {
            lessons: {
              include: {
                materials: true,
                homeworks: true,
                exams: true,
              },
              orderBy: { id: 'asc' }
            }
          },
          orderBy: { id: 'asc' }
        },
        courseComments: {
          include: {
            user: { select: { id: true, fullName: true, role: true, file: true } },
            replies: {
              include: {
                user: { select: { id: true, fullName: true, role: true, file: true } }
              },
              orderBy: { created_at: 'asc' }
            }
          },
          where: { parentId: null },
          orderBy: { created_at: 'desc' }
        }
      }
    });

    if (!course) {
      throw new NotFoundException("Kurs topilmadi");
    }

    return course;
  }
}
