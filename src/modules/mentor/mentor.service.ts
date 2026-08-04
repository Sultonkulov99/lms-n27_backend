import { PrismaService } from "src/core/database/prisma.service";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateMentorDto } from "./dto/mentor.dto";
import * as argon from "argon2"

@Injectable()
export class MentorService {
    constructor(private prisma: PrismaService) { }


    async getAll() {
        return this.prisma.user.findMany({
            where: { role: "MENTOR" },
            select: {
                id: true,
                fullName: true,
                phone: true,
                role: true,
                created_at: true,
                updated_at: true,
            },
        });
    }



 
    async getOne(id: number) {
        const mentor = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                fullName: true,
                phone: true,
                role: true,
                created_at: true,
                updated_at: true,
            },
        });

        if (!mentor) {
            throw new NotFoundException("Mentor topilmadi");
        }
        return mentor;

    }




    async create(dto: CreateMentorDto) {

        const existingUser = await this.prisma.user.findUnique({
            where: {
                phone: dto.phone,
            },
        });

        if (existingUser) {
            throw new ConflictException("Bu telefon taqamidagi foydalanuvchi allaqachon mavjud !")
        };



        const hashedPass = await argon.hash(dto.password);

        return this.prisma.user.create({
            data: {
                fullName: dto.fullName,
                phone: dto.phone,
                password: hashedPass,
                role: 'MENTOR',
            },

            select: {
                id: true,
                fullName: true,
                phone: true,
                role: true,
                created_at: true,
                updated_at: true,
            },

        });
    }




    async update(id: number, dto: Partial<CreateMentorDto>) {
        
        const mentor = await this.prisma.user.findFirst({
            where: {
                id,
                role: 'MENTOR',
            },
        });


        if (!mentor) {
            throw new NotFoundException('Mentor topilmadi');
        }


        if (dto.phone && dto.phone !== mentor.phone) {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    phone: dto.phone,
                },
            });

            if (existingUser) {
                throw new ConflictException(
                    'Bu telefon boshqa foydalanuvchiga tegishli',
                );
            }
        }


        if (dto.password) {
            dto.password = await argon.hash(dto.password);
        }


        return this.prisma.user.update({
            where: { id },
            data: dto,
            select: {
                id: true,
                fullName: true,
                phone: true,
                role: true,
                created_at: true,
                updated_at: true,
            },
        });
    }



    async remove(id: number) {

        const mentor = await this.prisma.user.findFirst({
            where: {
                id,
                role: "MENTOR",
            },
        });

        if (!mentor) {
            throw new NotFoundException("Mentor topilmadi");
        }

        await this.prisma.user.delete({
            where: { id },
        });

        return {
            message: 'Mentor muvaffaqiyatli uchirildi',

        };
    }
}