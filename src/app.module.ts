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
import { ProfileModule } from "./modules/profile/profile.module";
import { CommentsModule } from "./modules/comments/comments.module";
import { StudentsModule } from "./modules/students/students.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { ExamModule } from "./modules/exam/exam.module";

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
    LessonsModule,
    ProfileModule,
    MaterialsModule,
    CategoriesModule,
    CoursesModule,
    SectionsModule,
    LessonsModule,
    CourseAssistantModule,
    CommentsModule,
    StudentsModule,
    PaymentsModule,
    ExamModule,
  ],
})
export class AppModule {}
