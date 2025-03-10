import { AsyncErrorHandler } from "@/configs";
import { authController } from "@/controllers";
import { TokenMiddleware } from "@/middlewares";
import { Router } from "express";

const router = Router();

// sing up
router.post("/signup", AsyncErrorHandler(authController.signUp));

// verification mail
router.post(
  "/account/verification",
  AsyncErrorHandler(authController.sendVerificationMail)
);

// verify account
router.post(
  "/account/verify",
  AsyncErrorHandler(TokenMiddleware),
  AsyncErrorHandler(authController.verifyMail)
);

// sign in
router.post("/signin", AsyncErrorHandler(authController.signIn));

export { router as authRouter };
