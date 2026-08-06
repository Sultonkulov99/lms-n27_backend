import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdateUserDto {
  @ApiProperty({
    example: "Ali Valiyev",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  fullName?: string;

  @ApiProperty({
    example: "+998901234567",
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: "Ali12345",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiProperty({
    required: false,
    type: "string",
    format: "binary",
  })
  @IsOptional()
  file?: any;
}
