import { PrismaService } from "src/core/database/prisma.service";
import { Injectable } from "@nestjs/common";
import { CreateMentorDto } from "./dto/mentor.dto";
import * as argon from "argon2"

@Injectable()
export class MentorService {
    constructor(private prisma: PrismaService) {}
    
    async getAll() {
        return this.prisma.user.findMany({
            where: { role: "MENTOR" },
        });
    }
 
    async getOne(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async create(dto: CreateMentorDto) {
        const hashedPass = await argon.hash(dto.password);

        return this.prisma.user.create({
            data: {
                fullName: dto.fullName,
                phone: dto.phone,
                password: hashedPass,
                role: 'MENTOR',
            },
        });
    }



    async update(id: number, dto: Partial<CreateMentorDto>) {
        return this.prisma.user.update({
            where: { id },
            data: dto,
        });
    }



    async remove(id: number) {
        return this.prisma.user.delete({
            where: { id },
        });
    }
}