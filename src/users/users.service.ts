import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { UserRoles } from "@prisma/client";
import { PrismaService } from "src/core/database/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllAdmins() {
        const admins = await this.prisma.user.findMany({where: {role: UserRoles.ADMIN}})

        return {
            success: true,
            data: admins,
        }
    }
    async createAdmin(payload: CreateUserDto) {
        const admin = await this.prisma.user.findFirst({where: {role: UserRoles.ADMIN, phone: payload.phone}})

        if(admin) {
            throw new ConflictException('User has already existed')
        }

        const newAdmin = await this.prisma.user.create({
            data: {
                ...payload,
                role: UserRoles.ADMIN,
            }
        })

        return {
            success: true,
            data: newAdmin,
        }
    }

    async updateAdmin(id: number, payload: UpdateUserDto) {
        const existingAdmin = await this.prisma.user.findFirst({where: {id}})

        if(!existingAdmin) throw new NotFoundException("Admin is not found")

        const admin = await this.prisma.user.findFirst({where: {role: UserRoles.ADMIN, phone: payload.phone}})

        if(admin) throw new ConflictException('User has already existed')

        const updatedAdmin = await this.prisma.user.update({
            where: {id},
            data: {
                ...payload,
            }
        })

        return {
            success: true,
            data: updatedAdmin,
        }
    }

    async deleteAdmin(id: number) {
        const existingAdmin = await this.prisma.user.findFirst({where: {id}})

        if(!existingAdmin) throw new NotFoundException("Admin is not found")

        await this.prisma.user.delete({where: {id}})

        return {
            success: true,
            data: existingAdmin,
        }
    }
}