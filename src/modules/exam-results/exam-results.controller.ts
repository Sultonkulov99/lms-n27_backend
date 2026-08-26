import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserRoles } from "@prisma/client";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { Roles } from "src/common/decorators/roles.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { CreateExamResultDto } from "./dto/create-exam-result.dto";
import { ExamResultsDto } from "./dto/exam-results.dto";
import { ExamResultsService } from "./exam-results.service";

@ApiTags("Exam Results")
@Controller("exam-results")
export class ExamResultsController {
    constructor(private readonly service: ExamResultsService) {}

    @Get()
    @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
    @ApiBearerAuth("accessToken")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Faqat ADMIN - Barcha imtihon natijalarini olish" })
    async findAll(@Query() query: ExamResultsDto) {
        return await this.service.findAll(query);
    }

    @Get("mine")
    @ApiBearerAuth("accessToken")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "O'zimning imtihon natijalarim" })
    async findMine(
        @CurrentUser() user: { id: number },
        @Query() query: ExamResultsDto,
    ) {
        return await this.service.findMine(user.id, query);
    }

    @Post()
    @ApiBearerAuth("accessToken")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "Imtihon javoblarini yuborish" })
    async create(
        @CurrentUser() user: { id: number },
        @Body() dto: CreateExamResultDto,
    ) {
        return await this.service.create(user.id, dto);
    }
}
