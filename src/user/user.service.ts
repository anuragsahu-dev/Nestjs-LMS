import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async createUserWithEmail(email: string) {
    const user = await this.prisma.user.create({
      data: {
        email,
      },
    });
    return user;
  }
}
