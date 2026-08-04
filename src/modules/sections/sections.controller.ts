import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SectionsService } from "./sections.service";
import { CreateSectionDto } from "./dto/create-section.dto";
import { UpdateSectionDto } from "./dto/update-section.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRoles } from "src/common/enums";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";

@ApiTags("Sections")
@Controller("sections")
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Get()
  @Roles(UserRoles.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "Faqat SUPERADMIN - Barcha bo'limlarni olish" })
  findAll() {
    return this.sectionsService.findAll();
  }

  @Get(":id")
  @Roles(UserRoles.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "Faqat SUPERADMIN - Bo'limni id bo'yicha olish" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.sectionsService.findOne(id);
  }

  @Post()
  @Roles(UserRoles.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "Faqat SUPERADMIN - Yangi bo'lim yaratish" })
  create(@Body() dto: CreateSectionDto) {
    return this.sectionsService.create(dto);
  }

  @Patch(":id")
  @Roles(UserRoles.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "Faqat SUPERADMIN - Bo'limni tahrirlash" })
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateSectionDto) {
    return this.sectionsService.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Faqat SUPERADMIN - Bo'limni o'chirish" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.sectionsService.remove(id);
  }
}
