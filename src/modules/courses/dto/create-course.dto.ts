import { ApiProperty } from "@nestjs/swagger";
import { CourseLevel } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";

export class CreateCourseDto {
  @ApiProperty({
    example: "any",
  })
  @IsString()
  @IsNotEmpty()
  banner: string;

  @ApiProperty({
    example: "video.mp4?",
  })
  @IsString()
  @IsOptional()
  introVideo?: string;

  @ApiProperty({
    example: "Full-stack",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: "Node.js & Vue.js",
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: "BEGINNER!",
  })
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @ApiProperty({
    example: "12345",
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;

  @ApiProperty({
    example: "1",
  })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  categoryId: number;
}
