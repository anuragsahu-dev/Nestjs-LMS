import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import configuration from "./config/configuration";
import { envValidationSchema } from "./config/env.validation";
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env.development"],
      isGlobal: true,
      load: [configuration],
      validationSchema: envValidationSchema,
    }),
    AuthModule,
    PrismaModule,
    UserModule,
  ],
})
export class AppModule {}
