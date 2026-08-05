import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { CoursesService } from "./courses.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { UserRoles } from "@prisma/client";
import { Roles } from "src/common/decorators/roles.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { courseFileFilter, courseFileStorage } from "./courses.multer";

const fileInterceptor = FileFieldsInterceptor(
  [
    { name: "banner", maxCount: 1 },
    { name: "introVideo", maxCount: 1 },
  ],
  {
    storage: courseFileStorage,
    fileFilter: courseFileFilter,
    limits: { fileSize: 500 * 1024 * 1024 },
  },
);

export type CourseFiles = {
  banner?: Express.Multer.File[];
  introVideo?: Express.Multer.File[];
};

@ApiTags("Courses")
@Controller("courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "SUPERADMIN - Barcha kurslarni olish" })
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(":id")
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "SUPERADMIN - Kursni id bo'yicha olish" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.coursesService.findOne(id);
  }

  @Post()
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAuthGuard, RolesGuard)
<<<<<<< HEAD
  @ApiOperation({ summary: "SUPERADMIN - Yangi kurs yaratish" })
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
=======
  @ApiOperation({ summary: "Faqat SUPERADMIN - Yangi kurs yaratish" })
  @ApiConsumes("multipart/form-data")
  @ApiExtraModels(CreateCourseDto)
  @ApiBody({ type: CreateCourseDto })
  @UseInterceptors(fileInterceptor)
  create(@Body() dto: CreateCourseDto, @UploadedFiles() files: CourseFiles) {
    if (!files?.banner?.[0]) {
      throw new BadRequestException("Banner majburiy");
    }
    return this.coursesService.create(dto, files);
>>>>>>> 980613c0c55dd365ced22dcf1f47788cbca2eb4c
  }

  @Patch(":id")
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAuthGuard, RolesGuard)
<<<<<<< HEAD
  @ApiOperation({ summary: "SUPERADMIN - Kursni tahrirlash" })
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(id, dto);
=======
  @ApiOperation({ summary: "Faqat SUPERADMIN - Kursni tahrirlash" })
  @ApiConsumes("multipart/form-data")
  @ApiExtraModels(UpdateCourseDto)
  @ApiBody({ type: UpdateCourseDto })
  @UseInterceptors(fileInterceptor)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateCourseDto,
    @UploadedFiles() files: CourseFiles,
  ) {
    return this.coursesService.update(id, dto, files);
>>>>>>> 980613c0c55dd365ced22dcf1f47788cbca2eb4c
  }

  @Delete(":id")
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "SUPERADMIN - Kursni o'chirish" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.coursesService.remove(id);
  }
}
