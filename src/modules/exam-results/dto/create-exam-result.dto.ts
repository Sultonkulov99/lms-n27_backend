import { ApiProperty } from "@nestjs/swagger";
import { TestAnswer } from "@prisma/client";
import { Type } from "class-transformer";
import {
    ArrayNotEmpty,
    IsArray,
    IsEnum,
    IsInt,
    IsNotEmpty,
    ValidateNested,
} from "class-validator";

export class SubmitAnswerDto {
    @ApiProperty({
        example: 101,
        description: "Exam (savol) ID",
    })
    @IsInt()
    @IsNotEmpty()
    examId: number;

    @ApiProperty({
        enum: TestAnswer,
        example: TestAnswer.variantA,
        description: "Tanlangan variant",
    })
    @IsEnum(TestAnswer)
    @IsNotEmpty()
    answer: TestAnswer;
}

export class CreateExamResultDto {
    @ApiProperty({
        example: 12,
        description: "Imtihon topshirilayotgan dars ID",
    })
    @IsInt()
    @IsNotEmpty()
    lessonId: number;

    @ApiProperty({
        type: [SubmitAnswerDto],
        description: "O'quvchi belgilagan javoblar",
        example: [
            { examId: 101, answer: TestAnswer.variantA },
            { examId: 102, answer: TestAnswer.variantC },
        ],
    })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => SubmitAnswerDto)
    answers: SubmitAnswerDto[];
}
