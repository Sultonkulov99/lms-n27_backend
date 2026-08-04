import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Backend',
    description: 'Category Name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}