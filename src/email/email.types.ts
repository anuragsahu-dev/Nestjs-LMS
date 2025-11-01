export enum EmailType {
  OTP = "otp",
  PAYMENT_SUCCESS = "payment_success",
}

export interface EmailPayload<T extends EmailType = EmailType> {
  email: string;
  subject: string;
  type: T;
  data: T extends EmailType.OTP
    ? { otp: string }
    : T extends EmailType.PAYMENT_SUCCESS
    ? { username: string; amount: number; transactionId: string }
    : Record<string, unknown>;
}
