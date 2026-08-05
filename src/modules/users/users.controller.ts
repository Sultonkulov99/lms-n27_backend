import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { UserService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { Roles } from "src/common/decorators/roles.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { UserRoles } from "@prisma/client";

@Controller("users")
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "SUPERADMIN - Barcha foydalanuvchi olish" })
  async getAllAdmins() {
    return await this.service.getAllAdmins();
  }

  @Post()
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "SUPERADMIN - Yangi foydalanuvchi yaratish" })
  async createAdmin(
    @Body() payload: CreateUserDto,
    @UploadedFile()
    image?: Express.Multer.File,
  ) {
    return await this.service.createAdmin(payload, image);
  }

  @Patch(":id")
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "SUPERADMIN - Foydalanuvchini tahrirlash" })
  async updateAdmin(@Param("id") id: number, @Body() payload: CreateUserDto) {
    return await this.service.updateAdmin(id, payload);
  }

  @Delete(":id")
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "SUPERADMIN - Foydalanuvchini o'chirish" })
  async deleteAdmin(@Param("id") id: number) {
    return await this.service.deleteAdmin(id);
  }
}
