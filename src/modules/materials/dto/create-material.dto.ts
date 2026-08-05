import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateMaterialDto {
  @ApiProperty({
    example: 1,
    description: "Lesson ID",
  })
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
    type: [String],
    example: ["uploads/file-1.pdf", "uploads/file-2.jpg"],
    description: "Material file",
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  file: string[];
}
