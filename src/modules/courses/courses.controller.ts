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
import { CoursesService } from "./courses.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

@ApiTags("Courses")
@Controller("courses")
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) {}

    @Get()
    @ApiOperation({ summary: "Barcha kurslarni olish" })
    findAll() {
        return this.coursesService.findAll();
    }

    @Get(":id")
    @ApiOperation({ summary: "Kursni id bo'yicha olish" })
    findOne(@Param("id", ParseIntPipe) id: number) {
        return this.coursesService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: "Yangi kurs yaratish" })
    create(@Body() dto: CreateCourseDto) {
        return this.coursesService.create(dto);
    }

    @Patch(":id")
    @ApiOperation({ summary: "Kursni tahrirlash" })
    update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateCourseDto) {
        return this.coursesService.update(id, dto);
    }

    @Delete(":id")
    @ApiOperation({ summary: "Kursni o'chirish" })
    remove(@Param("id", ParseIntPipe) id: number) {
        return this.coursesService.remove(id);
    }
}
