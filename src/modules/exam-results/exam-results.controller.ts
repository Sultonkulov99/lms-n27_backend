import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import { UserRoles } from "@prisma/client";
import { Roles } from "src/common/decorators/roles.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { ExamResultsService } from "./exam-results.service";
import { ExamResultsDto } from "./dto/exam-results.dto";


@ApiTags("Admin / Imtihon Natijalari")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoles.ADMIN, UserRoles.SUPERADMIN, UserRoles.MENTOR)
@Controller("exam-results")
export class ExamResultsController {
    constructor(private readonly examResultsService: ExamResultsService) {}

    @ApiOperation({
        summary:
            "Imtihon natijalari ro'yxatini olish (Search, Date Filter va Pagination bilan)",
    })
    @ApiResponse({ status: 200, description: "Natijalar ro'yxati" })
    @Get()
    findAll(@Query() query: ExamResultsDto) {
        return this.examResultsService.findAll(query);
    }
}
