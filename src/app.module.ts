import { Module } from "@nestjs/common";
import { PrismaModule } from "./core/database/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { SeederModule } from "./core/seed/seeder.module";
import { CoursesModule } from "./modules/courses/courses.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { CourseAssistantModule } from "./modules/course-assistant/course-assistant.module";
import { AuthModule, SectionsModule } from "./modules";
import { MentorModule } from "./modules/mentor/mentor.module";
<<<<<<< HEAD
import { MaterialsModule } from "./modules/materials/materials.module";
=======
import { AdminModule } from "./modules/admin/admin.module";
import { LessonsModule } from "./modules/lessons/lessons.module";
>>>>>>> 980613c0c55dd365ced22dcf1f47788cbca2eb4c

@Module({
  imports: [
    ConfigModule.forRoot({  
      isGlobal: true,
    }),
    PrismaModule,
    SeederModule,
    CoursesModule,
    AuthModule,
    SectionsModule,
    CategoriesModule,
    CourseAssistantModule,
    AdminModule,
    MentorModule,
<<<<<<< HEAD
    MaterialsModule,
=======
    LessonsModule
>>>>>>> 980613c0c55dd365ced22dcf1f47788cbca2eb4c
  ],
})
export class AppModule {}
