import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CourseAssistantService } from './course-assistant.service';
import { CreateCourseAssistantDto } from './dto/create-course-assistant.dto';
import { UpdateCourseAssistantDto } from './dto/update-course-assistant.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRoles } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags('Course Assistant')
@Controller('course-assistant')
export class CourseAssistantController {
  constructor(
    private readonly courseAssistantService: CourseAssistantService,
  ) {}

  @Post()
  @Roles(UserRoles.SUPERADMIN)
    @ApiBearerAuth("access-token")
    @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'SUPERADMIN - Create Course Assistant' })
  create(@Body() dto: CreateCourseAssistantDto) {
    return this.courseAssistantService.create(dto);
  }

  @Get()
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'SUPERADMIN - Get All Course Assistants' })
  findAll() {
    return this.courseAssistantService.findAll();
  }

  @Get(':id')
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'SUPERADMIN - Get Course Assistant By ID' })
  findOne(@Param('id') id: string) {
    return this.courseAssistantService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'SUPERADMIN - Update Course Assistant' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCourseAssistantDto,
  ) {
    return this.courseAssistantService.update(+id, dto);
  }

  @Delete(':id')
  @Roles(UserRoles.SUPERADMIN)
  @ApiBearerAuth("access-token")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'SUPERADMIN - Delete Course Assistant' })
  remove(@Param('id') id: string) {
    return this.courseAssistantService.remove(+id);
  }
}