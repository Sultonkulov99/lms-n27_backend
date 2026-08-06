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
import { diskStorage } from "multer";
import { extname } from "path";
import { UpdateAdminDto } from "./dto/update-admin.dto";

@Controller("admin")
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get()
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "SUPERADMIN" })
  async getAllAdmins() {
    return await this.service.getAllAdmins();
  }

  @Post()
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "SUPERADMIN" })
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
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "SUPERADMIN" })
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async updateAdmin(
    @Param("id") id: number,
    @Body() payload: UpdateAdminDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.service.updateAdmin(id, payload, file);
  }

  @Delete(":id")
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "SUPERADMIN" })
  async deleteAdmin(@Param("id") id: number) {
    return await this.service.deleteAdmin(id);
  }
}
