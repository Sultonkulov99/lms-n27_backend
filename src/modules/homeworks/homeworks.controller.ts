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
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiTags,
} from '@nestjs/swagger';

import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { HomeworksService } from './homeworks.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRoles } from '../../common/enums/user-roles.enum';

@ApiTags('Homeworks')
@ApiBearerAuth()
@Controller('homeworks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HomeworksController {
  constructor(
    private readonly homeworksService: HomeworksService,
  ) {}

  @Post()
  @Roles(
    UserRoles.SUPERADMIN,
    UserRoles.ADMIN,
    UserRoles.MENTOR,
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        lessonId: {
          type: 'number',
          example: 1,
        },
        description: {
          type: 'string',
          example: 'Homework description',
        },
        file: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      required: ['lessonId', 'description'],
    },
  })
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: './uploads/homeworks',
        filename(req, file, cb) {
          const unique =
            Date.now() +
            '-' +
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

  @Get()
  @Roles(
    UserRoles.SUPERADMIN,
    UserRoles.ADMIN,
    UserRoles.MENTOR,
  )
  findAll() {
    return this.homeworksService.findAll();
  }

  @Get(':id')
  @Roles(
    UserRoles.SUPERADMIN,
    UserRoles.ADMIN,
    UserRoles.MENTOR,
  )
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.homeworksService.findOne(id);
  }

  
  @Patch(':id')
  @Roles(
    UserRoles.SUPERADMIN,
    UserRoles.ADMIN,
    UserRoles.MENTOR,
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        lessonId: {
          type: 'number',
        },
        description: {
          type: 'string',
        },
        file: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: './uploads/homeworks',
        filename(req, file, cb) {
          const unique =
            Date.now() +
            '-' +
            Math.round(Math.random() * 100000);

          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHomeworkDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.homeworksService.update(id, dto, files);
  }

  @Delete(':id')
  @Roles(
    UserRoles.SUPERADMIN,
    UserRoles.ADMIN,
    UserRoles.MENTOR,
  )
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.homeworksService.remove(id);
  }
}