import { CourseLevel } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    banner: string;

    @IsString()
    @IsOptional()
    introVideo?: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsEnum(CourseLevel)
    level: CourseLevel;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    price: number;

    @IsInt()
    @IsPositive()
    @Type(() => Number)
    categoryId: number;
}
