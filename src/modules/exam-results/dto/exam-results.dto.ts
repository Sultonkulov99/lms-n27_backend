import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class ExamResultsDto {
    @ApiPropertyOptional({
        description: "O'quvchi ismi yoki familiyasi bo'yicha qidiruv",
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ description: "Boshlanish sanasi" })
    @IsOptional()
    @IsString()
    startDate?: string;

    @ApiPropertyOptional({
        description: "Tugash sanasi",
    })
    @IsOptional()
    @IsString()
    endDate?: string;

    @ApiPropertyOptional({
        example: 1,
        description: "Kurs bo'yicha filtr (lessons -> sections -> courses)",
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    courseId?: number;

    @ApiPropertyOptional({
        example: 1,
        description: "Bo'lim bo'yicha filtr (lessons -> sections)",
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    sectionId?: number;

    @ApiPropertyOptional({
        example: 1,
        description: "O'quvchi (user) bo'yicha filtr",
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    userId?: number;

    @ApiPropertyOptional({
        example: 1,
        description: "Dars bo'yicha filtr",
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    lessonId?: number;

    @ApiPropertyOptional({
        example: 1,
        description: "Sahifa raqami. limit bilan birga ishlatiladi",
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @ApiPropertyOptional({
        example: 10,
        description:
            "Bir sahifadagi yozuvlar soni. Berilmasa barcha natijalar qaytariladi",
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;
}
