import { Module } from "@nestjs/common";
import { PrismaModule } from "./core/database/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { SeederModule } from "./core/seed/seeder.module";
import { CoursesModule } from "./modules/courses/courses.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { CourseAssistantModule } from "./modules/course-assistant/course-assistant.module";
import { AuthModule, SectionsModule } from "./modules";
import { MentorModule } from "./modules/mentor/mentor.module";
import { MaterialsModule } from "./modules/materials/materials.module";
import { LessonsModule } from "./modules/lessons/lessons.module";
import { UsersModule } from "./modules/users/users.module";
import { CommentsModule } from "./modules/comments/comments.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    SeederModule,
    AuthModule,
    UsersModule,
    MentorModule,
    MaterialsModule,
    CategoriesModule,
    CoursesModule,
    SectionsModule,
    LessonsModule,
    CourseAssistantModule,
    CommentsModule
  ],
})
export class AppModule {}
