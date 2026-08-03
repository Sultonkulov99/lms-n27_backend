import { Module } from '@nestjs/common';
import { PrismaModule } from './core/database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { SeederModule } from './core/seed/seeder.module';
import { CoursesModule } from './modules/courses/courses.module';

import { CategoriesModule } from './categories/categories.module';
import { CourseAssistantModule } from './course-assistant/course-assistant.module';
import { UserModule } from './users/users.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    PrismaModule,
    SeederModule,
    CoursesModule,
  ],
}) 
export class AppModule {}
