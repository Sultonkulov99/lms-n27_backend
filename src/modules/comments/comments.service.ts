import {
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { CreateCommentsDto } from "./dto/create-comments";
import { UpdateCommentsDto } from "./dto/update-comments";

@Injectable()
export class CommentsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateCommentsDto) {
        return await this.prisma.comments.create({
            data: dto,
        });
    }

    async findAll() {
        return await this.prisma.comments.findMany();
    }

    async findOne(id: number) {
        const comment = await this.prisma.comments.findUnique({
            where: { id },
        });
        if (!comment) {
            throw new NotFoundException("Comment not found");
        }
        return { success: true, data: comment };
    }

    async update(id: number, dto: UpdateCommentsDto) {
        const existing = await this.prisma.comments.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new NotFoundException("Comment not found");
        }

        return await this.prisma.comments.update({
            where: { id },
            data: dto,
        });
    }

    async delete(id: number) {
        const existing = await this.prisma.comments.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new NotFoundException("Comment not found");
        }

        await this.prisma.comments.delete({
            where: { id },
        });
        return { success: true, message: "Comment deleted" };
    }
}
