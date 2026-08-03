import { Module } from '@nestjs/common';
import { PrismaModule } from './core/database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { SeederModule } from './core/seed/seeder.module';
import { CoursesModule } from './modules/courses/courses.module';

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
