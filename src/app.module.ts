import { Module } from '@nestjs/common';
import { PrismaModule } from './core/database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { SeederModule } from './core/seed/seeder.module';
<<<<<<< HEAD
import { CoursesModule } from './modules/courses/courses.module';

import { CategoriesModule } from './modules/categories/categories.module';
import { CourseAssistantModule } from './modules/course-assistant/course-assistant.module';
import { UserModule } from './modules/users/users.module';

=======
import { MentorModule } from './config/modules/mentor.module';
>>>>>>> ebf26f7 (..)

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    PrismaModule,
    SeederModule,
<<<<<<< HEAD
    CoursesModule,
=======
    MentorModule
>>>>>>> ebf26f7 (..)
  ],
}) 
export class AppModule {}
