import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({
        example: 'Ali Valiyev',
    })
    @IsOptional()
    @IsString()
    @MinLength(5)
    fullName: string;

    @ApiProperty({
        example: '+998901234567',
    })
    @IsOptional()
    @IsString()
    phone: string;

    @ApiProperty({
        example: 'Ali12345',
    })
    @IsOptional()
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