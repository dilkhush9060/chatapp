import { AsyncErrorHandler } from "@/configs";
import { profileController } from "@/controllers";
import { AuthMiddleware, limiter, picMiddleware } from "@/middlewares";
import { Router } from "express";

const router = Router();
router.use(limiter(60, 10));

router.get(
  "/",
  AsyncErrorHandler(AuthMiddleware),
  AsyncErrorHandler(profileController.getProfile)
);

router.patch(
  "/",
  AsyncErrorHandler(AuthMiddleware),
  AsyncErrorHandler(profileController.updateProfile)
);

router.patch(
  "/picture",
  AsyncErrorHandler(AuthMiddleware),
  AsyncErrorHandler(picMiddleware.single("file")),
  AsyncErrorHandler(profileController.updateProfilePicture)
);

router.get("/all", AsyncErrorHandler(profileController.getAllProfiles));

router.get("/:id", AsyncErrorHandler(profileController.getSingleProfile));

router.post(
  "/:id/follow",
  AsyncErrorHandler(AuthMiddleware),
  AsyncErrorHandler(profileController.toggleFollow)
);

export { router as profileRouter };
