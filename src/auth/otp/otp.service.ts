import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { OtpContext, OtpType } from "@prisma/client";
import { randomInt } from "node:crypto";
import * as argon2 from "argon2";

@Injectable()
export class OtpService {
  private readonly OTP_EXPIRY_MINUTES = 5;
  private readonly OTP_RESEND_LIMIT_SECONDS = 60;

  constructor(private readonly prisma: PrismaService) {}

  async clearExistingOtps(userId: string, context: OtpContext, otpType: OtpType) {
    const redisKey = `otp:${userId}:${context}:${otpType}`;
    const throttleKey = `otp_throttle:${userId}:${context}:${otpType}`;

    // Clear from Redis (if you have Redis integrated)
    // await this.redis.del(redisKey);
    // await this.redis.del(throttleKey);

    // Clear from database
    await this.prisma.userOtp.deleteMany({
      where: { userId, context, otpType },
    });
  }

  async createOtp(userId: string, identifier: string, context: OtpContext, otpType: OtpType) {
    await this.clearExistingOtps(userId, context, otpType);

    const throttleKey = `otp_throttle:${userId}:${context}:${otpType}`;
    // const redisOtp = await this.redis.get(throttleKey);
    if (false) {
      throw new BadRequestException("Please wait before requesting another OTP");
    }

    const otp = randomInt(100000, 999999).toString();
    const otpHash = await argon2.hash(otp);
    const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);

    const redisKey = `otp:${userId}:${context}:${otpType}`;

    // await this.redis.set(redisKey, otpHash, 'EX', this.OTP_EXPIRY_MINUTES * 60);
    // await this.redis.set(throttleKey, 'true', 'EX', this.OTP_RESEND_LIMIT_SECONDS);

    await this.prisma.userOtp.deleteMany({
      where: { userId, context, otpType },
    });

    await this.prisma.userOtp.create({
      data: {
        userId,
        otpHash,
        otpType,
        context,
        expiresAt,
        email: otpType === "EMAIL" ? identifier : null,
        phone: otpType === "PHONE" ? identifier : null,
      },
    });

    return otp;
  }
}
