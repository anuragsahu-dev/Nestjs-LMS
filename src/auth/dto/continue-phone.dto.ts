import { Transform } from "class-transformer";
import { IsNotEmpty, Matches } from "class-validator";

export class ContinuePhoneDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsNotEmpty({ message: "Phone number is required" })
  @Matches(/^(\+91|91)?[6-9]\d{9}$/, {
    message: "Please provide a valid phone number",
  })
  phone: string;
}
