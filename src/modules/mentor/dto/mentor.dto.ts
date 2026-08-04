import { IsString, MinLength } from 'class-validator';

export class CreateMentorDto {
  @IsString()
  @MinLength(3)
  fullName: string;

  @IsString()
  @MinLength(9)
  phone: string;

  @IsString()
  @MinLength(6)
  password: string;
}