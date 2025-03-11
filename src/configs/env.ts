import dotenvFlow from "dotenv-flow";
dotenvFlow.config();

// config env
const _environment = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 5000,

  DATABASE_URL: process.env.DATABASE_URL || "",

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",
  TOKEN_SECRET: process.env.TOKEN_SECRET || "",

  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: process.env.SMTP_PORT || "",
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || "",

  KAFKA_BROKER: process.env.KAFKA_BROKER || "",
};

export const myEnvironment = Object.freeze(_environment);
