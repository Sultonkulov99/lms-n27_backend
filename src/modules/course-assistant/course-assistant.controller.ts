import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CourseAssistantService } from './course-assistant.service';
import { CreateCourseAssistantDto } from './dto/create-course-assistant.dto';
import { UpdateCourseAssistantDto } from './dto/update-course-assistant.dto';

@ApiTags('Course Assistant')
@Controller('course-assistant')
export class CourseAssistantController {
  constructor(
    private readonly courseAssistantService: CourseAssistantService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Course Assistant' })
  create(@Body() dto: CreateCourseAssistantDto) {
    return this.courseAssistantService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get All Course Assistants' })
  findAll() {
    return this.courseAssistantService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Course Assistant By ID' })
  findOne(@Param('id') id: string) {
    return this.courseAssistantService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Course Assistant' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCourseAssistantDto,
  ) {
    return this.courseAssistantService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Course Assistant' })
  remove(@Param('id') id: string) {
    return this.courseAssistantService.remove(+id);
  }
}