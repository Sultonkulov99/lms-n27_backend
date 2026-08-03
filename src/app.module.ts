import { Module } from '@nestjs/common';
import { PrismaModule } from './core/database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { SeederModule } from './core/seed/seeder.module';
<<<<<<< HEAD
import { CategoriesModule } from './categories/categories.module';
import { CourseAssistantModule } from './course-assistant/course-assistant.module';

=======
import { UserModule } from './users/users.module';
>>>>>>> b35bbea59f24d2ddb6ecd915585c026768af86ef

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    PrismaModule,
    SeederModule,
    CategoriesModule,
    CourseAssistantModule,
    UserModule,
  ],
}) 
export class AppModule {}
