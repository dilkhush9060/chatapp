import { AsyncErrorHandler } from "@/configs";
import { feedController } from "@/controllers";
import { AuthMiddleware, picMiddleware } from "@/middlewares";
import { Router } from "express";

const router = Router();

// create feed
router.post(
  "/",
  AsyncErrorHandler(AuthMiddleware),
  AsyncErrorHandler(picMiddleware.single("file")),
  AsyncErrorHandler(feedController.create)
);

// Get all feeds
router.get("/", AsyncErrorHandler(feedController.listAll));

// update feed
router.patch(
  "/:id",
  AsyncErrorHandler(AuthMiddleware),
  AsyncErrorHandler(feedController.update)
);

// delete feed
router.delete(
  "/:id",
  AsyncErrorHandler(AuthMiddleware),
  AsyncErrorHandler(feedController.delete)
);

// my feeds
router.get(
  "/my",
  AsyncErrorHandler(AuthMiddleware),
  AsyncErrorHandler(feedController.myFeeds)
);

// get feed
router.get("/:id", AsyncErrorHandler(feedController.singleFeed));

export { router as feedRouter };
