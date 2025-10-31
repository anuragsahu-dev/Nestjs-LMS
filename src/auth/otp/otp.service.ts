import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { OtpContext, OtpType } from "@prisma/client";
import { randomInt } from "node:crypto";
import * as argon2 from "argon2";
import { RedisService } from "../../redis/redis.service";

@Injectable()
export class OtpService {
  private readonly OTP_EXPIRY_MINUTES = 5;
  private readonly OTP_RESEND_LIMIT_SECONDS = 60;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async clearExistingOtps(userId: string, context: OtpContext, otpType: OtpType) {
    const redisKey = `otp:${userId}:${context}:${otpType}`;
    const throttleKey = `otp_throttle:${userId}:${context}:${otpType}`;

    await this.redisService.del(redisKey);
    await this.redisService.del(throttleKey);

    await this.prisma.userOtp.deleteMany({
      where: { userId, context, otpType },
    });
  }

  async createOtp(userId: string, identifier: string, context: OtpContext, otpType: OtpType) {
    await this.clearExistingOtps(userId, context, otpType);

    const throttleKey = `otp_throttle:${userId}:${context}:${otpType}`;
    const redisOtp = await this.redisService.get(throttleKey);
    if (redisOtp) {
      throw new BadRequestException("Please wait before requesting another OTP");
    }

    const otp = randomInt(100000, 999999).toString();
    const otpHash = await argon2.hash(otp);
    const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);

    const redisKey = `otp:${userId}:${context}:${otpType}`;

    await this.redisService.set(redisKey, otpHash, this.OTP_EXPIRY_MINUTES * 60);
    await this.redisService.set(throttleKey, "true", this.OTP_RESEND_LIMIT_SECONDS);

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
