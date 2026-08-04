import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { MentorService } from './mentor.service';
import { CreateMentorDto } from '../dto/mentor.dto';

@Controller('mentors')
export class MentorController {
  constructor(private mentorService: MentorService) {}

  @Get()
  getAll() {
    return this.mentorService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.mentorService.getOne(Number(id));
  }

  @Post()
  create(@Body() dto: CreateMentorDto) { 
    return this.mentorService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateMentorDto>) {
    return this.mentorService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mentorService.remove(Number(id));
  }
} 