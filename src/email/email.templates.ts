import Mailgen from "mailgen";
import type { Content } from "mailgen";

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "LMS App",
    link: "https://lms.example.com",
  },
});

type TemplateDataMap = {
  otp: { otp: string };
  payment_success: { username: string; amount: number; transactionId: string };
};

const EmailTemplates: {
  [K in keyof TemplateDataMap]: (data: TemplateDataMap[K]) => Content;
} = {
  otp: (data) => ({
    body: {
      intro: "Use the following OTP to verify your account.",
      table: {
        data: [{ OTP: data.otp }],
      },
      outro: "This OTP will expire in 5 minutes.",
    },
  }),

  payment_success: (data) => ({
    body: {
      name: data.username,
      intro: `Your payment of ₹${data.amount} was successful.`,
      table: {
        data: [{ "Transaction ID": data.transactionId }],
      },
      outro: "Thank you for your purchase!",
    },
  }),
};

export function generateEmailTemplate<T extends keyof TemplateDataMap>(
  type: T,
  data: TemplateDataMap[T],
) {
  const content = EmailTemplates[type](data);
  return {
    html: mailGenerator.generate(content),
    text: mailGenerator.generatePlaintext(content),
  };
}
