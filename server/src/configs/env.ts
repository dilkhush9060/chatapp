import dotenvFlow from "dotenv-flow";
dotenvFlow.config();

// config env
const _environment = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 5000,

  DATABASE_URI: "",

  ACCESS_TOKEN_SECRET: "",
  REFRESH_TOKEN_SECRET: "",
  TOKEN_SECRET: "",
};

export const myEnvironment = Object.freeze(_environment);
