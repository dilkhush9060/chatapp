import { AsyncErrorHandler } from "@/configs";
import { authController } from "@/controllers";
import { AuthMiddleware, limiter, TokenMiddleware } from "@/middlewares";
import { Router } from "express";

const router = Router();
router.use(limiter(60, 10));

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

// password forget
router.post(
  "/password/forget",
  AsyncErrorHandler(authController.forgetPassword)
);

// password reset
router.post(
  "/password/reset",
  AsyncErrorHandler(TokenMiddleware),
  AsyncErrorHandler(authController.resetPassword)
);

// password change
router.post(
  "/password/change",
  AsyncErrorHandler(AuthMiddleware),
  AsyncErrorHandler(authController.changePassword)
);

export { router as authRouter };
