import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
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
                created_at: true,
                updated_at: true,
            }
        })

    return {
      success: true,
      students,
    };
  }

  async getOneStudent(id: number) {
    const student = await this.prisma.user.findUnique({
      where: { id, role: UserRoles.STUDENT },
      select: {
        id: true,
        fullName: true,
        phone: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!student) {
      throw new NotFoundException("Bunaqa student yo'q. Yana bilmadim:)!");
    }
    return {
      success: true,
      student,
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
    const ExistingStudent = await this.prisma.user.findFirst({
      where: {
        id,
        role: UserRoles.STUDENT,
      },
    });

    if (!ExistingStudent) throw new NotFoundException("Student is not found");

    await this.prisma.user.delete({ where: { id } });

        if (!ExistingStudent) throw new NotFoundException("Student is not found")

        try {
            // Delete related records in the correct order (respecting foreign keys)
            
            // 1. Delete exam answers (depends on examAttempts)
            await this.prisma.examAnswers.deleteMany({
                where: {
                    attempt: {
                        userId: id
                    }
                }
            });

            // 2. Delete exam attempts
            await this.prisma.examAttempts.deleteMany({
                where: { userId: id }
            });

            // 3. Delete exam results
            await this.prisma.examResults.deleteMany({
                where: { userId: id }
            });

            // 4. Delete exams created by this user
            await this.prisma.exams.deleteMany({
                where: { userId: id }
            });

            // 5. Delete payments
            await this.prisma.payments.deleteMany({
                where: { userId: id }
            });

            // 6. Delete course assistants
            await this.prisma.courseAssistant.deleteMany({
                where: { userId: id }
            });

            // 7. Delete mentor profile if exists
            await this.prisma.mentorProfile.deleteMany({
                where: { userId: id }
            });

            // 8. Finally delete the user
            await this.prisma.user.delete({ where: { id } })

            return {
                success: true,
                message: "Student successfully deleted with all related records"
            }
        } catch (error) {
            throw new Error(`Failed to delete student: ${error.message}`)
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
        progress: 0, // Yoki ExamAttempts'dan hisoblash mumkin
        lastAccessedAt: payment.created_at.toISOString(),
    }));

    return myCourses;
}

}
