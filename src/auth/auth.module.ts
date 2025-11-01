import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { OtpModule } from '../otp/otp.module';

@Module({
  imports: [UserModule, OtpModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
