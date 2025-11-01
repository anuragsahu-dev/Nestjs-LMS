import { getEnvVariable } from "./get-env";

export default () => ({
  server: {
    port: Number(getEnvVariable("PORT")),
    nodeEnv: getEnvVariable("NODE_ENV"),
    clientUrl: getEnvVariable("CLIENT_URL"),
  },
  database: {
    url: getEnvVariable("DATABASE_URL"),
  },
  auth: {
    accessTokenSecret: getEnvVariable("ACCESS_TOKEN_SECRET"),
    refreshTokenSecret: getEnvVariable("REFRESH_TOKEN_SECRET"),
    accessTokenExpiry: getEnvVariable("ACCESS_TOKEN_EXPIRY"),
    refreshTokenExpiry: getEnvVariable("REFRESH_TOKEN_EXPIRY"),
  },
  smtp: {
    host: getEnvVariable("SMTP_HOST"),
    port: Number(getEnvVariable("SMTP_PORT")),
    user: getEnvVariable("SMTP_USER"),
    pass: getEnvVariable("SMTP_PASS"),
  },
  redis: {
    host: getEnvVariable("REDIS_HOST"),
    port: Number(getEnvVariable("REDIS_PORT")),
  },
  bcrypt: {
    saltRounds: Number(getEnvVariable("SALT_ROUNDS")),
  },
  google: {
    clientId: getEnvVariable("GOOGLE_CLIENT_ID"),
    clientSecret: getEnvVariable("GOOGLE_CLIENT_SECRET"),
    callbackUrl: getEnvVariable("GOOGLE_CALLBACK_URL"),
  },
  rabbitmq: {
    url: getEnvVariable("RABBITMQ_URL")
  }
});
