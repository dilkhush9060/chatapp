import pino, { LoggerOptions } from "pino";
import { AppRequest, AppResponse } from "@/types";
import pinoHttp from "pino-http";
import useragent from "useragent";
import { Socket } from "node:net";

// options for pino logger
const options: LoggerOptions = {
  level: "info",
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: {
    targets: [
      {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "yyyy-mm-dd HH:MM:ss",
          ignore: "pid,hostname",
          singleLine: true,
        },
      },
      {
        target: "pino/file",
        options: {
          destination: "./logs/info.log",
          mkdir: true,
          append: true,
        },
        level: "info",
      },
      {
        target: "pino/file",
        options: {
          destination: "./logs/warn.log",
          mkdir: true,
          append: true,
        },
        level: "warn",
      },
      {
        target: "pino/file",
        options: {
          destination: "./logs/error.log",
          mkdir: true,
          append: true,
        },
        level: "error",
      },
    ],
    dedupe: true,
  },
};

export const logger = pino(options);

interface ParsedUserAgent {
  os: {
    toString(): string;
  };
  toAgent(): string;
}

interface CustomRequest extends AppRequest {
  headers: {
    "user-agent"?: string;
    "x-forwarded-for"?: string;
  };

  connection: Socket & {
    remoteAddress?: string | undefined;
  };
}

export const httpLogger = pinoHttp({
  logger,
  serializers: {
    req: (request: CustomRequest) => {
      const userAgentString = request.headers["user-agent"] || "";

      const agent = useragent.parse(userAgentString) as ParsedUserAgent;

      return {
        method: request.method,
        url: request.url,
        ip:
          request.headers["x-forwarded-for"] ||
          request.connection?.remoteAddress ||
          request.socket?.remoteAddress ||
          request.ip ||
          "unknown",
        userAgent: userAgentString,
        device: {
          platform: agent.os.toString(),
          browser: agent.toAgent(),
        },
      };
    },
    res: (response: AppResponse) => ({
      statusCode: response.statusCode,
    }),
  },
});
