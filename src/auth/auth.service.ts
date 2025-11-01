import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { OtpService } from "../otp/otp.service";
import { OtpContext, OtpType } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly otpService: OtpService,
  ) {}

  async continueWithEmail(email: string) {
    let user = await this.userService.getUserByEmail(email);
    if (!user) {
      user = await this.userService.createUserWithEmail(email);
    }

    // clear existing otps

    await this.otpService.clearExistingOtps(user.id, OtpContext.MOBILE);

    const otp = await this.otpService.createOtp(user.id, email, OtpContext.MOBILE, OtpType.EMAIL);

    // 4️⃣ (Optional) Send OTP via Email queue or EmailService (RabbitMQ later)
    // await this.rabbitmqService.sendOtpEmail({ email, otp });

    // 5️⃣ Return response
    // return {
    //   message: 'OTP sent successfully to your email',
    //   expiresIn: `${this.otpService['OTP_EXPIRY_MINUTES']} minutes`,
    //   ...(process.env.NODE_ENV !== 'production' && { otp }), // return OTP only in dev
    // };
  }

  // redis set karna and rabbitmq set karna hai and email sevice set karna hai
  //  I have to use managed redis, redis cloud by redis lab
  async continueWithPhone(phone: string) {}
}
