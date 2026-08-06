import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRoles } from "@prisma/client";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { CreateCommentsDto } from "./dto/create-comments";
import { UpdateCommentsDto } from "./dto/update-comments";

@ApiTags("Comments")
@Controller()
export class CommentsController {
    constructor(private readonly service: CommentsService) {}

    @Post()
    create(@Body() dto: CreateCommentsDto) {
        return this.service.create(dto);
    }

    @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
    @ApiBearerAuth("access-token")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    @ApiOperation({
        summary: "Faqat SUPERADMIN va ADMIN - Barcha commentlarni ko'rish",
    })
    findAll() {
        return this.service.findAll();
    }

    @Get(":id")
    @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
    @ApiBearerAuth("access-token")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({
        summary: "Faqat SUPERADMIN va ADMIN -commentlarni id bo'yicha ko'rish",
    })
    findOne(@Param("id") id: string) {
        return this.service.findOne(+id);
    }

    @ApiOperation({
        summary: "Faqat SUPERADMIN va ADMIN - Commentlarni update qilish",
    })
    @Put(":id")
    @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
    @ApiBearerAuth("access-token")
    @UseGuards(JwtAuthGuard, RolesGuard)
    update(@Param("id") id: string, @Body() dto: UpdateCommentsDto) {
        return this.service.update(+id, dto);
    }

    @Delete(":id")
    @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
    @ApiBearerAuth("access-token")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({
        summary: "Faqat SUPERADMIN va ADMIN - Commentlarni o'chirish",
    })
    delete(@Param("id") id: string) {
        return this.service.delete(+id);
    }
}