import { Module } from "@nestjs/common";
import { StudentService } from "./students.service";
import { StudentController } from "./students.controller";
import { PrismaService } from "src/core/database/prisma.service";

@Module({
    providers: [StudentService, PrismaService],
    controllers: [StudentController],
})
export class StudentsModule {}