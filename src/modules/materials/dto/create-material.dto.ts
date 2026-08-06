import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateMaterialDto {
  @ApiProperty({
    example: 1,
    description: "Lesson ID",
    type: Number,
  })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsNotEmpty()
  lessonId: number;

  @ApiProperty({
    example: "1-dars",
    description: "Material description",
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: "array",
    items: { type: "string", format: "binary" },
    description: "Material file",
  })
  @IsOptional()
  file: any[];
}
