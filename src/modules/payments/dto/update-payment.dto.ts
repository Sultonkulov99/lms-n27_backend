import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePaymentDto } from "./create-payment.dto";
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
