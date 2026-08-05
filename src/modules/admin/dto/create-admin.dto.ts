import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateAdminDto {
    @ApiProperty({
        example: 'Ali Valiyev',
    })
    @IsString()
    @MinLength(5)
    fullName: string;

    @ApiProperty({
        example: '+998901234567',
    })
    @IsString()
    phone: string;

    @ApiProperty()
    @IsString()
    @MinLength(8)
    password: string;

    @ApiProperty({
        required: false,
        type: 'string',
    })
    @IsOptional()
    file?: any;
}