import { AsyncErrorHandler } from "@/configs";
import { authController } from "@/controllers";
import { AuthMiddleware, limiter, TokenMiddleware } from "@/middlewares";
import { Router } from "express";

const router = Router();
router.use(limiter(60, 10));

router.post("/signup", AsyncErrorHandler(authController.signUp));

router.post(
  "/account/verification",
  AsyncErrorHandler(authController.sendVerificationMail)
);

router.post(
  "/account/verify",
  AsyncErrorHandler(TokenMiddleware),
  AsyncErrorHandler(authController.verifyMail)
);

router.post("/signin", AsyncErrorHandler(authController.signIn));

router.post(
  "/password/forget",
  AsyncErrorHandler(authController.forgetPassword)
);

router.post(
  "/password/reset",
  AsyncErrorHandler(TokenMiddleware),
  AsyncErrorHandler(authController.resetPassword)
);

router.post(
  "/password/change",
  AsyncErrorHandler(AuthMiddleware),
  AsyncErrorHandler(authController.changePassword)
);

router.post("/signout", AsyncErrorHandler(authController.signOut));

export { router as authRouter };
