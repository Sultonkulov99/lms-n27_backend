import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { PrismaService } from "src/core/database/prisma.service";

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

  async findOne(id: number) {
    const existing = await this.prisma.payments.findUnique({
      where: { id },
      include: { course: true, user: true },
    });

    if (!existing) {
      throw new NotFoundException("Payment not found");
    }

    return {
      success: true,
      data: existing,
    };
  }

  async update(id: number, payload: UpdatePaymentDto) {
    try {
      await this.findOne(id);

      const payment = await this.prisma.payments.update({
        where: { id },
        data: payload,
        include: { course: true, user: true },
      });
    } catch (error) {
      throw new NotFoundException("Payment not found");
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      return this.prisma.payments.delete({ where: { id } });
    } catch (error) {
      throw new NotFoundException(`Payment not found`);
    }
  }
}
