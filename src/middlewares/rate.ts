import { AppRequest, AppResponse } from "@/types";
import rateLimit from "express-rate-limit";

// Rate limiter
export const limiter = (sec: number, max: number) => {
  return rateLimit({
    windowMs: 1000 * sec,
    max: max,
    message: {
      status: 429,
      success: false,
      error: "Too Many Requests",
      message: "You have exceeded the request limit. Try again later.",
    },
    headers: true,
    handler: (_req: AppRequest, res: AppResponse) => {
      res.status(429).json({
        status: 429,
        success: false,
        error: "Too Many Requests",
        message:
          "Slow down! You have exceeded the rate limit. Please try again later.",
      });
    },
  });
};
