import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/core/database/prisma.service";
import { ExamResultsDto } from "./dto/exam-results.dto";
import { CreateExamResultDto } from "./dto/create-exam-result.dto";

const isPassing = (correctAnswer: number, totalQuestions: number) =>
    correctAnswer * 2 > totalQuestions;

const resultInclude = {
    user: {
        select: {
            id: true,
            fullName: true,
            phone: true,
            file: true,
        },
    },
    lessons: {
        select: {
            id: true,
            name: true,
            sections: {
                select: {
                    id: true,
                    name: true,
                    courses: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
    },
} satisfies Prisma.ExamResultsInclude;

type ExamResultWithRelations = Prisma.ExamResultsGetPayload<{
    include: typeof resultInclude;
}>;

@Injectable()
export class ExamResultsService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(query: ExamResultsDto) {
        const where = this.buildWhere(query);
        return this.paginate(where, query.page, query.limit);
    }

    async findMine(userId: number, query: ExamResultsDto) {
        const where = this.buildWhere({ ...query, userId });
        return this.paginate(where, query.page, query.limit);
    }

    async create(userId: number, dto: CreateExamResultDto) {
        const exams = await this.prisma.exams.findMany({
            where: { lessonId: dto.lessonId },
            select: { id: true, answer: true },
        });

        if (exams.length === 0) {
            throw new BadRequestException(
                "Bu dars uchun imtihon savollari topilmadi",
            );
        }

        const submitted = new Map<number, string>();
        for (const item of dto.answers) {
            if (!submitted.has(item.examId)) {
                submitted.set(item.examId, item.answer);
            }
        }

        let correctAnswer = 0;
        let wrongAnswer = 0;

        for (const exam of exams) {
            if (submitted.get(exam.id) === exam.answer) {
                correctAnswer++;
            } else {
                wrongAnswer++;
            }
        }

        const percent = Math.round(
            (correctAnswer / (correctAnswer + wrongAnswer)) * 100,
        );

        const created = await this.prisma.examResults.create({
            data: {
                userId,
                lessonId: dto.lessonId,
                correctAnswer,
                wrongAnswer,
                isPassed: isPassing(correctAnswer, exams.length),
            },
            include: resultInclude,
        });

        return {
            success: true,
            message: "Imtihon natijasi saqlandi",
            data: {
                ...this.format(created),
                totalQuestions: exams.length,
                percent,
            },
        };
    }

    private buildWhere(query: ExamResultsDto): Prisma.ExamResultsWhereInput {
        const { search, startDate, endDate, courseId, sectionId, userId, lessonId } =
            query;

        const where: Prisma.ExamResultsWhereInput = {};

        if (userId) {
            where.userId = userId;
        }

        if (lessonId) {
            where.lessonId = lessonId;
        }

        if (courseId || sectionId) {
            where.lessons = {
                sections: {
                    ...(sectionId && { id: sectionId }),
                    ...(courseId && { courseId }),
                },
            };
        }

        if (search) {
            where.user = {
                fullName: {
                    contains: search,
                    mode: "insensitive",
                },
            };
        }

        if (startDate || endDate) {
            const created_at: Prisma.DateTimeFilter = {};
            if (startDate) {
                created_at.gte = new Date(startDate);
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                created_at.lte = end;
            }
            where.created_at = created_at;
        }

        return where;
    }

    private async paginate(
        where: Prisma.ExamResultsWhereInput,
        page?: number,
        limit?: number,
    ) {
        const currentPage = page ?? 1;

        const [total, results] = await Promise.all([
            this.prisma.examResults.count({ where }),
            this.prisma.examResults.findMany({
                where,
                ...(limit && { skip: (currentPage - 1) * limit, take: limit }),
                orderBy: { created_at: "desc" },
                include: resultInclude,
            }),
        ]);

        return {
            success: true,
            data: results.map((item) => this.format(item)),
            meta: {
                total,
                page: currentPage,
                limit: limit ?? total,
                totalPages: limit ? Math.ceil(total / limit) : 1,
            },
        };
    }

    private format(item: ExamResultWithRelations) {
        const section = item.lessons.sections;
        const course = section.courses;

        return {
            id: item.id,
            userId: item.userId,
            lessonId: item.lessonId,
            courseId: course.id,
            sectionId: section.id,
            correctAnswer: item.correctAnswer,
            wrongAnswer: item.wrongAnswer,
            isPassed: item.isPassed,
            created_at: item.created_at.toISOString(),
            user: {
                id: item.user.id,
                fullName: item.user.fullName,
                phone: item.user.phone,
                file: this.toRelativePath(item.user.file),
            },
            course: {
                id: course.id,
                name: course.name,
            },
            section: {
                id: section.id,
                name: section.name,
            },
            lesson: {
                id: item.lessons.id,
                name: item.lessons.name,
            },
        };
    }

    private toRelativePath(file: string | null): string | null {
        if (!file) return null;

        if (/^https?:\/\//i.test(file)) {
            try {
                return new URL(file).pathname;
            } catch {
                return file;
            }
        }

        if (file.startsWith("/")) return file;

        return `/uploads/avatars/${file}`;
    }
}
