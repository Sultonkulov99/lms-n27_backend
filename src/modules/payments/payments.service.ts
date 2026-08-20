import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { PrismaService } from "src/core/database/prisma.service";
import { Current } from "../courses/courses.service";

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) { }

  async checkCoursePurchased(courseId: number, userId: number) {
    const course = await this.prisma.courses.findUnique({
      where: {
        id: courseId,
      },
    });
    if (!course) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }
    const purchased = await this.prisma.payments.findFirst({
      where: {
        courseId: courseId,
        userId: userId,
      },
    });
    if (purchased) {
      throw new HttpException(
        'This course already purchased',
        HttpStatus.BAD_REQUEST,
      );
    }
    return { purchased, course };
  }

  async create(payload: CreatePaymentDto) {
    const { course } = await this.checkCoursePurchased(
      payload.courseId,
      payload.userId,
    );
    return this.prisma.payments.create({
      data: {
        courseId: payload.courseId,
        userId: payload.userId,
        amount: Number(course.price),
      },
    });
  }

  async findAll() {
    const payments = await this.prisma.payments.findMany({
      include: { course: true, user: true },
      orderBy: { created_at: "desc" },
    });

    return {
      success: true,
      data: payments,
    };
  }

  async findOne(courseId: number, userId: number) {
    const purchased = await this.prisma.payments.findFirst({
      where: {
        courseId: courseId,
        userId: userId,
      },
    });
    if (!purchased) {
      throw new HttpException(
        'This course has not been purchased',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      success: true,
      data: purchased,
    };
  }

  async update(courseId: number, userId: number) {
    try {
      const { data: purchased } = await this.findOne(courseId, userId)

      if (purchased.status === true) {
        await this.prisma.payments.update({
          where: { id: purchased.id },
          data: { status: false },
        });

        return {
          success: true,
          message: "Payment status successfully updated to PENDING"
        }
      } else {
        await this.prisma.payments.update({
          where: { id: purchased.id },
          data: { status: true },
        });

        return {
          success: true,
          message: "Payment status successfully updated to COMPLETED"
        }
      }

    } catch (error) {
      throw new NotFoundException("Payment not found");
    }
  }

  async remove(courseId: number, user: Current) {
    try {
      const { data: purchased } = await this.findOne(courseId, user.id)
      return this.prisma.payments.delete({ where: { id: purchased.id } });
    } catch (error) {
      throw new NotFoundException(`Payment not found`);
    }
  }
}
