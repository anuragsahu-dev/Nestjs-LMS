import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ContinueEmailDto } from "./dto/continue-email.dto";
import { ContinuePhoneDto } from "./dto/continue-phone.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("continue-email")
  async continueWithEmail(@Body() dto: ContinueEmailDto) {
    return this.authService.continueWithEmail(dto.email);
  }

  @Post("continue-phone")
  async continueWithPhone(@Body() dto: ContinuePhoneDto) {
    return this.authService.continueWithPhone(dto.phone);
  }
}
