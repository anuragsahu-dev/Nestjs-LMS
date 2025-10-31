import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import configuration from "./config/configuration";
import { envValidationSchema } from "./config/env.validation";
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';

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
  ],
})
export class AppModule {}
