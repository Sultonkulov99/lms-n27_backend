import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { StudentService } from "./students.service";
import { Roles } from "src/common/decorators/roles.decorator";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { Status, UserRoles } from "@prisma/client";
import { ApiBearerAuth, ApiConsumes, ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { CreateUserDto } from "../users/dto/create-user.dto";

@Controller("students")
export class StudentController {
  constructor(private readonly service: StudentService) {}

  @Get()
  @Roles(UserRoles.SUPERADMIN, UserRoles.ADMIN)
  @ApiBearerAuth("accessToken")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "Faqat ADMIN - Barcha studentlarni olish" })
  async getAllStudents(
    @Query("status", new ParseEnumPipe(Status, { optional: true }))
    status?: Status,
  ) {
    return await this.service.getAllStudents(status);
  }

  @Get("my-courses")
  @Roles(UserRoles.STUDENT, UserRoles.SUPERADMIN)
  @ApiBearerAuth("accessToken")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "Faqat STUDENT - o'zi to'lagan kurslarni olish" })
  async getMyCourses(@CurrentUser() user: { id: number }) {
    return await this.service.getMyCourses(user.id);
  }

  @Post()
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth("accessToken")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Faqat SUPERADMIN  - Studentni yaratolidi" })
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads/avatars",
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async createAdmin(
    @Body() payload: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.service.createStudent(payload, file);
  }

<<<<<<< HEAD
  @Patch(":id")
  @Roles(UserRoles.ADMIN, UserRoles.SUPERADMIN, UserRoles.STUDENT)
  @ApiBearerAuth("accessToken")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Faqat ADMIN - Studentni tahrirlash" })
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads/avatars",
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async updateStudent(
    @Param("id") id: number,
    @Body() payload: UpdateStudentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.service.updateStudent(id, payload, file);
  }
=======
    @Get("my-courses/:courseId")
    @Roles(UserRoles.STUDENT , UserRoles.SUPERADMIN, UserRoles.ADMIN)
    @ApiBearerAuth('accessToken')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Faqat STUDENT - bitta kursning to'liq tafsilotlarini olish (darslar bilan)" })
    async getMyCourseDetails(
        @Param("courseId") courseId: string, 
        @CurrentUser() user: { id: number }
    ) {
        return await this.service.getStudentCourseDetails(+courseId, user.id);
    }

    @Patch(":id")
    @Roles(UserRoles.ADMIN , UserRoles.SUPERADMIN , UserRoles.STUDENT)
    @ApiBearerAuth('accessToken')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Faqat ADMIN - Studentbi tahrirlash" })
    async updateStudent(@Param("id") id: number, @Body() payload: UpdateStudentDto) {
        return await this.service.updateStudent(id, payload);
    }
>>>>>>> e482997f6fdf63e11f0f95ab5be8cb01331518fc

  @Patch(":id/archive")
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth("accessToken")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "Faqat ADMIN - Studentni tahrirlash" })
  async archiveStudent(@Param("id") id: number) {
    return await this.service.archiveStudent(id);
  }

  @Patch(":id/restore")
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth("accessToken")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "Faqat ADMIN - Studentni tahrirlash" })
  async restoreStudent(@Param("id") id: number) {
    return await this.service.restoreStudent(id);
  }

  @Delete(":id")
  @Roles(UserRoles.ADMIN, UserRoles.SUPERADMIN)
  @ApiBearerAuth("accessToken")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "Faqat ADMIN - Studentni o'chiradi" })
  async deleteStudent(@Param("id") id: number) {
    return await this.service.deleteStudent(id);
  }
}
