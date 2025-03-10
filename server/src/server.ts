import path from "node:path";
import { createServer } from "node:http";
import express, { Application } from "express";

// file imports
import { AppRequest, AppResponse } from "@/types";
import {
  logger,
  myEnvironment,
  globalErrorHandler,
  httpLogger,
  notFoundHandler,
} from "@/configs";
import { authRouter } from "@/routes";

// app init
const app: Application = express();

// middlewares
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../", "public")));
app.use(httpLogger);

// health check
app.get("/", (_: AppRequest, response: AppResponse) => {
  response
    .status(200)
    .json({ status: "ok", statusCode: 200, message: "server is running" });
});

// routers
app.use("/api/auth", authRouter);

// 404
app.use(notFoundHandler);

// global error handle
app.use(globalErrorHandler);

// http server
const server = createServer(app);

// socket init

// try start server
server.listen(myEnvironment.PORT, () => {
  logger.info(`✅ Server is running on http://127.0.0.1:${myEnvironment.PORT}`);
});

// Handle server errors
server.on("error", (error) => {
  logger.error(
    `❌ Server error: ${
      error instanceof Error ? error.message : "Unknown error"
    }`
  );
  process.exit(1);
});

// Handle unexpected errors
process.on("uncaughtException", (error) => {
  logger.error(`💥 Uncaught Exception: ${error.message}`);
  process.exit(1);
});

// un handle rejection
process.on("unhandledRejection", (reason: unknown): void => {
  logger.error(`⚠️ Unhandled Rejection: ${String(reason)}`);
  process.exit(1);
});
