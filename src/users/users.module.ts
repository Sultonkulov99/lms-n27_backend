import { Module } from "@nestjs/common";
import { UserService } from "./users.service";
import { UserController } from "./users.controller";
import { PrismaService } from "src/core/database/prisma.service";

@Module({
    providers: [UserService, PrismaService],
    controllers: [UserController],
})

export class UserModule {}