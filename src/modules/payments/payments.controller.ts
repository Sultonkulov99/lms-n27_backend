import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserRoles } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('courseId') id: number, @CurrentUser() user: { id: number; role: UserRoles }) {
    return this.paymentsService.findOne(id, user.id);
  }

  @Patch()
  update(@Body() payload: UpdatePaymentDto) {
    return this.paymentsService.update(Number(payload.courseId), Number(payload.userId));
  }

  @Delete(':id')
  remove(@Param('courseId') id: number, @CurrentUser() user: { id: number; role: UserRoles }) {
    return this.paymentsService.remove(id, user);
  }
}
