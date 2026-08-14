import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { PrismaService } from "src/core/database/prisma.service";

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreatePaymentDto) {
    const payment = await this.prisma.payments.create({
      data: payload,
      include: { course: true, user: true },
    });

    return {
      success: true,
      data: true,
    };
  }

  async findAll() {
    const payments = await this.prisma.payments.findMany({
      include: { course: true, user: true, category: true },
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
      include: { course: true, user: true, category: true },
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
        include: { course: true, user: true, category: true },
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
