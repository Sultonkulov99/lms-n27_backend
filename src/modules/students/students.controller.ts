import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { StudentService } from "./students.service";
import { Roles } from "src/common/decorators/roles.decorator";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { UserRoles } from "@prisma/client";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { UpdateStudentDto } from "./dto/update-student.dto";

@Controller("students")
export class StudentController {
    constructor(private readonly service: StudentService) { }

    @Get()
    @Roles(UserRoles.SUPERADMIN , UserRoles.ADMIN)
    @ApiBearerAuth('accessToken')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Faqat ADMIN - Barcha studentlarni olish" })
    async getAllStudents() {
        return await this.service.getAllStudents();
    }


    @Get("my-courses")
    @Roles(UserRoles.STUDENT , UserRoles.SUPERADMIN)
    @ApiBearerAuth('accessToken')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Faqat STUDENT - o'zi to'lagan kurslarni olish" })
    async getMyCourses(@CurrentUser() user: { id: number }) {
        return await this.service.getMyCourses(user.id);
    }

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

    @Delete(":id")
    @Roles(UserRoles.ADMIN , UserRoles.SUPERADMIN)
    @ApiBearerAuth('accessToken')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: "Faqat ADMIN - Studentni o'chiradi" })
    async deleteStudent(@Param("id") id: number) {
        return await this.service.deleteStudent(id);
    }
}