import { Module } from "@nestjs/common";
import { PrismaModule } from "./core/database/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { SeederModule } from "./core/seed/seeder.module";
import { AuthModule } from "./modules";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    SeederModule,
    AuthModule,
  ],
})
export class AppModule {}
