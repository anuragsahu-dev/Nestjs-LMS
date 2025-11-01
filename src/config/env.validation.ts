import * as Joi from "joi";

export const envValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string().valid("development", "production", "test").required(),
  CLIENT_URL: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .required(),

  DATABASE_URL: Joi.string()
    .uri({ scheme: ["postgres", "postgresql"] })
    .required(),

  ACCESS_TOKEN_SECRET: Joi.string().min(32).required(),
  REFRESH_TOKEN_SECRET: Joi.string().min(32).required(),
  ACCESS_TOKEN_EXPIRY: Joi.string().default("15m"),
  REFRESH_TOKEN_EXPIRY: Joi.string().default("7d"),

  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().default(587),
  SMTP_USER: Joi.string().required(),
  SMTP_PASS: Joi.string().required(),

  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),

  SALT_ROUNDS: Joi.number().default(10),

  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .required(),
    
  RABBITMQ_URL: Joi.string().uri({scheme: ["amqp"]}).required()
});
