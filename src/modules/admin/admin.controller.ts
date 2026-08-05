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
import { AdminService } from "./admin.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { Roles } from "src/common/decorators/roles.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { UserRoles } from "@prisma/client";

@Controller("admin")
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get()
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "Faqat SUPERADMIN" })
  async getAllAdmins() {
    return await this.service.getAllAdmins();
  }

  @Post()
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Faqat SUPERADMIN" })
  async createAdmin(
    @Body() payload: CreateAdminDto,
    @UploadedFile()
    image?: Express.Multer.File,
  ) {
    return await this.service.createAdmin(payload, image);
  }

  @Patch(":id")
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "Faqat SUPERADMIN" })
  async updateAdmin(@Param("id") id: number, @Body() payload: CreateAdminDto) {
    return await this.service.updateAdmin(id, payload);
  }

  @Delete(":id")
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "Faqat SUPERADMIN" })
  async deleteAdmin(@Param("id") id: number) {
    return await this.service.deleteAdmin(id);
  }
}
