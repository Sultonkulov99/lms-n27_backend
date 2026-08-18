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
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.coursesService.findOne(id);
  }

  @Post()
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth("accessToken")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "SUPERADMIN - Yangi kurs yaratish" })
  @ApiConsumes("multipart/form-data")
  @ApiExtraModels(CreateCourseDto)
  @ApiBody({ type: CreateCourseDto })
  @UseInterceptors(fileInterceptor)
  create(@Body() dto: CreateCourseDto, @UploadedFiles() files: CourseFiles) {
    if (!files?.banner?.[0]) {
      throw new BadRequestException("Banner majburiy");
    }
    return this.coursesService.create(dto, files);
  }

  @Patch(":id")
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth("accessToken")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "SUPERADMIN - Kursni tahrirlash" })
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
  }

  @Delete(":id")
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth("accessToken")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "SUPERADMIN - Kursni o'chirish" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.coursesService.remove(id);
  }
}
