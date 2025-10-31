import { Global, Module } from "@nestjs/common";
import Redis from "ioredis";
import { ConfigService } from "@nestjs/config";
import { RedisService } from "./redis.service";

@Global()
@Module({
  providers: [
    {
      provide: "REDIS_CLIENT",
      useFactory: async (configService: ConfigService) => {
        const redis = new Redis({
          host: configService.get<string>("redis.host"),
          port: configService.get<number>("redis.port"),
        });

        redis.on("connect", () => console.log("Redis Connected"));
        redis.on("error", (err) => console.error("Redis Error:", err));

        return redis;
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: ["REDIS_CLIENT", RedisService],
})
export class RedisModule {}

//  password: process.env.REDIS_PASSWORD || undefined,
//  tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
