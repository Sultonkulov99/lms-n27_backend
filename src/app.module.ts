import { Module } from '@nestjs/common';
import { PrismaModule } from './core/database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { SeederModule } from './core/seed/seeder.module';
import { CoursesModule } from './modules/courses/courses.module';

import { CategoriesModule } from './modules/categories/categories.module';
import { CourseAssistantModule } from './modules/course-assistant/course-assistant.module';
import { UserModule } from './modules/users/users.module';
import { MentorModule } from './config/modules/mentor.module';
import { AuthModule, SectionsModule } from './modules';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    SeederModule,
    CoursesModule,
    MentorModule,
    AuthModule,
    SectionsModule,
  ],
})
export class AppModule {}
