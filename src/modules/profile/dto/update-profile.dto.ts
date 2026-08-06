import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsPhoneNumber } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Istamov Xurshid' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ example: '+998917911122' })
  @IsOptional()
  @IsPhoneNumber('UZ')
  phone?: string;

  @ApiPropertyOptional({ example: 'example@gmail.com' })
  @IsOptional()
  @IsEmail()
  email?: string;
}