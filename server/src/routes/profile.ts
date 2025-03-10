import { AsyncErrorHandler } from "@/configs";
import { profileController } from "@/controllers";
import { AuthMiddleware } from "@/middlewares";
import { Router } from "express";

const router = Router();

// get profile
router.get(
  "/",
  AsyncErrorHandler(AuthMiddleware),
  AsyncErrorHandler(profileController.getProfile)
);

export { router as profileRouter };
