import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { videoMulterConfig } from 'src/common/config/video-multer.config';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi dars yaratish' })
  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(CreateLessonDto)
  @ApiBody({
    schema: {
      allOf: [
        { $ref: getSchemaPath(CreateLessonDto) },
        {
          type: 'object',
          properties: {
            file: { type: 'string', format: 'binary' },
          },
          required: ['file'],
        },
      ],
    },
  })
  @UseInterceptors(FileInterceptor('file', videoMulterConfig))
  create(@Body() dto: CreateLessonDto, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Video fayl yuklanmadi');
    }

    return this.lessonsService.create({
      ...dto,
      file: `/uploads/video/${file.filename}`,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Barcha darslarni olish' })
  findAll() {
    return this.lessonsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta darsni olish' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Darsni yangilash' })
  @ApiParam({ name: 'id', type: Number })
  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(UpdateLessonDto)
  @ApiBody({
    schema: {
      allOf: [
        { $ref: getSchemaPath(UpdateLessonDto) },
        {
          type: 'object',
          properties: {
            file: { type: 'string', format: 'binary' },
          },
        },
      ],
    },
  })
  @UseInterceptors(FileInterceptor('file', videoMulterConfig))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLessonDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.lessonsService.update(id, {
      ...dto,
      ...(file && { file: `/uploads/video/${file.filename}` }),
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: "Darsni o'chirish" })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsService.remove(id);
  }
}