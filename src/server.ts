import path from "node:path";
import { createServer } from "node:http";
import express, { Application } from "express";
import cors from "cors";

// file imports
import { AppRequest, AppResponse } from "@/types";
import {
  logger,
  myEnvironment,
  globalErrorHandler,
  httpLogger,
  notFoundHandler,
} from "@/configs";
import { authRouter, feedRouter, profileRouter } from "@/routes";
import { swaggerDocs } from "./swagger";

// app init
const app: Application = express();

// middlewares
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../", "public")));
app.use(httpLogger);
app.use(
  cors({
    origin: ["http://localhost:5173", "*"],
    optionsSuccessStatus: 200,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    maxAge: 86400,
  })
);
app.disable("x-powered-by");

/**
 * @openapi
 * /:
 *   get:
 *     tags:
 *       - Health check
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 */
app.get("/", (_: AppRequest, response: AppResponse) => {
  response
    .status(200)
    .json({ success: true, statusCode: 200, message: "server is running" });
});

// swagger docs
swaggerDocs(app);

// routers
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/feeds", feedRouter);

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
