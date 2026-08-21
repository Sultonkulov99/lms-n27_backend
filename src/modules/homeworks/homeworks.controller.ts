import {
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
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

import { HomeworksService } from "./homeworks.service";
import { CreateHomeworkDto } from "./dto/create-homework.dto";
import { UpdateHomeworkDto } from "./dto/update-homework.dto";

import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRoles } from "@prisma/client";

@ApiTags("Homeworks")
@Controller("homeworks")
export class HomeworksController {
  constructor(
    private readonly homeworksService: HomeworksService,
  ) {}

  @Get()
  @Roles(
    UserRoles.SUPERADMIN,
    UserRoles.ADMIN,
    UserRoles.MENTOR,
    UserRoles.ASSISTANT,
    UserRoles.STUDENT,
  )
  @ApiBearerAuth("accessToken")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "Barcha homeworkslarni olish" })
  findAll() {
    return this.homeworksService.findAll();
  }

  @Get(":id")
  @Roles(
    UserRoles.SUPERADMIN,
    UserRoles.ADMIN,
    UserRoles.MENTOR,
    UserRoles.ASSISTANT,
    UserRoles.STUDENT,
  )
  @ApiBearerAuth("accessToken")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "Homeworkni id bo'yicha olish" })
  findOne(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.homeworksService.findOne(id);
  }

  @Post()
  @Roles(
    UserRoles.SUPERADMIN,
    UserRoles.ADMIN,
    UserRoles.MENTOR,
    UserRoles.ASSISTANT,
  )
  @ApiBearerAuth("accessToken")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "Homework yaratish" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        lessonId: {
          type: "integer",
          example: 1,
        },
        title: {
          type: "string",
          example: "Homework title",
        },
        description: {
          type: "string",
          example: "Homework description",
        },
        file: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
        },
      },
      required: ["lessonId", "description"],
    },
  })
  @UseInterceptors(
    FilesInterceptor("file", 10, {
      storage: diskStorage({
        destination: "./uploads/homeworks",
        filename(req, file, cb) {
          const unique =
            Date.now() +
            "-" +
            Math.round(Math.random() * 100000);

          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  create(
    @Body() dto: CreateHomeworkDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.homeworksService.create(dto, files);
  }

  @Patch(":id")
  @Roles(
    UserRoles.SUPERADMIN,
    UserRoles.ADMIN,
    UserRoles.MENTOR,
    UserRoles.ASSISTANT,
  )
  @ApiBearerAuth("accessToken")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        lessonId: {
          type: "integer",
          example: 1,
        },
        title: {
          type: "string",
          example: "Updated title",
        },
        description: {
          type: "string",
          example: "Updated homework",
        },
        file: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor("file", 10, {
      storage: diskStorage({
        destination: "./uploads/homeworks",
        filename(req, file, cb) {
          const unique =
            Date.now() +
            "-" +
            Math.round(Math.random() * 100000);

          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateHomeworkDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.homeworksService.update(id, dto, files);
  }

  @Delete(":id")
  @Roles(
    UserRoles.SUPERADMIN,
    UserRoles.ADMIN,
    UserRoles.MENTOR,
    UserRoles.ASSISTANT,
  )
  @ApiBearerAuth("accessToken")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: "Homeworkni o'chirish..." })
  remove(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.homeworksService.remove(id);
  }
}