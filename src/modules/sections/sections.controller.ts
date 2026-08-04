import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SectionsService } from "./sections.service";
import { CreateSectionDto } from "./dto/create-section.dto";
import { UpdateSectionDto } from "./dto/update-section.dto";

@ApiTags("Sections")
@Controller("sections")
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Get()
  @ApiOperation({ summary: "Barcha bo'limlarni olish" })
  findAll() {
    return this.sectionsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Bo'limni id bo'yicha olish" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.sectionsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Yangi bo'lim yaratish" })
  create(@Body() dto: CreateSectionDto) {
    return this.sectionsService.create(dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Bo'limni tahrirlash" })
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateSectionDto) {
    return this.sectionsService.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Bo'limni o'chirish" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.sectionsService.remove(id);
  }
}
