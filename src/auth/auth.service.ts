import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  // steps
  // - Check if user exists
  // - If not, create new user
  // - Generate and store OTP
  // - Send OTP to email
  // - Return response
  async continueWithEmail(email: string) {
     const user = await this.userService.getUserByEmail(email);
     if(!user){
        
     }
  }

  async continueWithPhone(phone: string) {}
}
