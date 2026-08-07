import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateHomeworkDto {
  @ApiProperty()
  @IsInt()
  lessonId: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiPropertyOptional({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  @IsOptional()
  file?: any;
}