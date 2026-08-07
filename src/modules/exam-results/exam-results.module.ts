import { Module } from "@nestjs/common";
import { ExamResultsService } from "./exam-results.service";
import { PrismaModule } from "src/core/database/prisma.module";
import { ExamResultsController } from "./exam-results.controller";

@Module({
    imports: [PrismaModule],
    controllers: [ExamResultsController],
    providers: [ExamResultsService],
    exports: [ExamResultsService],
})
export class ExamResultsModule {}
