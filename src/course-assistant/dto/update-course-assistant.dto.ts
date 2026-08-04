import { PartialType } from '@nestjs/swagger';
import { CreateCourseAssistantDto } from './create-course-assistant.dto';

export class UpdateCourseAssistantDto extends PartialType(
  CreateCourseAssistantDto,
) {}    