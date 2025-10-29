import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty } from "class-validator";

export class ContinueEmailDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim().toLowerCase() : value))
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Please provide a valid email address" })
  email: string;
}
