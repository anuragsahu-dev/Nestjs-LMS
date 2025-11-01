import { Injectable, OnModuleInit } from "@nestjs/common";
import { RabbitmqService } from "../rabbitmq/rabbitmq.service";
import { EmailService } from "./email.service";

interface OtpEmailMessage {
  email: string;
  otp: string;
  subject: string;
}

@Injectable()
export class EmailConsumer implements OnModuleInit {
  constructor(
    private readonly rabbitmqService: RabbitmqService,
    private readonly emailService: EmailService,
  ) {}

  async onModuleInit() {
    await this.rabbitmqService.consume<OtpEmailMessage>(
      "email_otp_queue",
      "otp_exchange",
      "email.otp",
      async (data) => {
        await this.emailService.sendOtpEmail(data.email, data.otp, data.subject);
      },
    );

    console.log("✅ EmailConsumer is listening to OTP queue...");
  }
}
