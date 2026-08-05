import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreateMentorDto {
  @ApiProperty({
    example: "Mr Kebyu",
  })
  @IsString()
  @MinLength(3)
  fullName: string;

  @ApiProperty({
    example: "+998990007007",
  })
  @IsString()
  @MinLength(9)
  phone: string;

  @ApiProperty({
    example: "Kebyu007",
  })
  @IsString()
  @MinLength(6)
  password: string;
}
