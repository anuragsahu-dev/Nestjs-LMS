import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import configuration from "./config/configuration";
import { envValidationSchema } from "./config/env.validation";
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { EmailModule } from './email/email.module';
import { OtpModule } from './otp/otp.module';

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
    RedisModule,
    RabbitmqModule,
    EmailModule,
    OtpModule,
  ],
})
export class AppModule {}
