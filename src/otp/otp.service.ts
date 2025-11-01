import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RedisService } from "../redis/redis.service";
import { OtpContext, OtpType } from "@prisma/client";
import { randomInt } from "node:crypto";
import * as argon2 from "argon2";

@Injectable()
export class OtpService {
  private OTP_EXPIRY_MINUTES = 5;
  private OTP_RESEND_LIMIT_SECONDS = 30;
  
  private getRedisKeys(userId: string, context: OtpContext) {
    const base = `:${userId}:${context}`;
    return {
      otpKey: `otp${base}`,
      throttleKey: `otp_throttle${base}`,
    };
  }

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async createOtp(userId: string, identifier: string, context: OtpContext, otpType: OtpType) {
    const { otpKey, throttleKey } = this.getRedisKeys(userId, context);

    const otp = randomInt(100000, 999999).toString();
    const otpHash = await argon2.hash(otp);
    const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);

    await this.redisService.set(otpKey, otpHash, this.OTP_EXPIRY_MINUTES * 60);
    await this.redisService.set(throttleKey, "true", this.OTP_RESEND_LIMIT_SECONDS);

    await this.prisma.userOtp.create({
      data: {
        userId,
        otpHash,
        otpType, // (EMAIL/PHONE)
        context, // WEB or Mobile
        expiresAt,
        email: otpType === "EMAIL" ? identifier : null,
        phone: otpType === "PHONE" ? identifier : null,
      },
    });

    return otp; 
  }

  async resendOtp(userId: string, identifier: string, context: OtpContext, otpType: OtpType) {
    const { throttleKey } = this.getRedisKeys(userId, context);
    const throttled = await this.redisService.get(throttleKey);
    if (throttled) {
      throw new BadRequestException("Please wait before requesting another OTP");
    }

    await this.clearExistingOtps(userId, context);

    return this.createOtp(userId, identifier, context, otpType);
  }

  async clearExistingOtps(userId: string, context: OtpContext) {
    const { otpKey, throttleKey } = this.getRedisKeys(userId, context);

    await this.redisService.del(otpKey);
    await this.redisService.del(throttleKey);

    await this.prisma.userOtp.deleteMany({
      where: { userId, context },
    });
  }

  async verifyOtp(userId: string, otp: string, context: OtpContext) {
    const { otpKey } = this.getRedisKeys(userId, context);
    const otpHash = await this.redisService.get(otpKey);

    if (!otpHash) {
      throw new BadRequestException("OTP expired or not found");
    }

    const ok = await argon2.verify(otpHash, otp);
    if (!ok) {
      throw new BadRequestException("Invalid OTP");
    }

    // success: cleanup
    await this.clearExistingOtps(userId, context);

    return { success: true };
  }
}
