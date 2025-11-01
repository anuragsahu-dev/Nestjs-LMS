import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import { generateEmailTemplate } from "./email.templates";
import { EmailPayload, EmailType } from "./email.types";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>("smtp.host"),
      port: this.configService.get<number>("smtp.port"),
      auth: {
        user: this.configService.get<string>("smtp.user"),
        pass: this.configService.get<string>("smtp.pass"),
      },
    });
  }

  async sendEmail(payload: EmailPayload) {
    const { email, subject, type, data } = payload;
    const { html, text } = generateEmailTemplate(type, data as any);

    await this.transporter.sendMail({
      from: `"LMS App" <${this.configService.get<string>("smtp.user")}>`,
      to: email,
      subject,
      text,
      html,
    });

    console.log(`✅ Email sent to ${email} (${type})`);
  }

  async sendOtpEmail(email: string, otp: string, subject: string) {
    await this.sendEmail({
      email,
      subject,
      type: EmailType.OTP,
      data: { otp },
    });
  }

  async sendPaymentSuccessEmail(
    email: string,
    username: string,
    amount: number,
    transactionId: string,
  ) {
    await this.sendEmail({
      email,
      subject: "Payment Successful",
      type: EmailType.PAYMENT_SUCCESS,
      data: { username, amount, transactionId },
    });
  }
}
