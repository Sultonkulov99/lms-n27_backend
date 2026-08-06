import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class UpdateStudentDto {
    @ApiProperty({
        example: "Palonchiyev Pistonchi"
    })
    @IsString()
    @MinLength(3)
    fullName: string;

    @ApiProperty({
        example: "+998997760306"
    })
    @IsString()
    @MinLength(9)
    phone: string;
}