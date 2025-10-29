import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
  async continueWithEmail(email: string) {}

  async continueWithPhone(phone: string) {}
}
