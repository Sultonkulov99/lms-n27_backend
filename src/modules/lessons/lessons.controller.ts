import {Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { videoMulterConfig } from 'src/common/config/video-multer.config';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
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
  findAll() {
    return this.lessonsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsService.findOne(id);
  }

  @Patch(':id')
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
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsService.remove(id);
  }
}