import { AsyncErrorHandler } from "@/configs";
import { profileController } from "@/controllers";
import { AuthMiddleware, picMiddleware } from "@/middlewares";
import { Router } from "express";

const router = Router();

// get profile
router.get(
  "/",
  AsyncErrorHandler(AuthMiddleware),
  AsyncErrorHandler(profileController.getProfile)
);

// update profile
router.patch(
  "/",
  AsyncErrorHandler(AuthMiddleware),
  AsyncErrorHandler(profileController.updateProfile)
);

// update profile
router.patch(
  "/picture",
  AsyncErrorHandler(AuthMiddleware),
  AsyncErrorHandler(picMiddleware.single("file")),
  AsyncErrorHandler(profileController.updateProfilePicture)
);

// all profiles
router.get("/all", AsyncErrorHandler(profileController.getAllProfiles));

// get single profile
router.get("/:id", AsyncErrorHandler(profileController.getSingleProfile));

export { router as profileRouter };
