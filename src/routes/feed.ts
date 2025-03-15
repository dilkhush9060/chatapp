import { AsyncErrorHandler } from "@/configs";
import { feedController } from "@/controllers";
import { AuthMiddleware, picMiddleware } from "@/middlewares";
import { Router } from "express";

const router = Router();

router.post(
  "/",
  AsyncErrorHandler(AuthMiddleware),
  AsyncErrorHandler(picMiddleware.single("file")),
  AsyncErrorHandler(feedController.create)
);

router.get("/", AsyncErrorHandler(feedController.listAll));

router.patch(
  "/:id",
  AsyncErrorHandler(AuthMiddleware),
  AsyncErrorHandler(feedController.update)
);

router.delete(
  "/:id",
  AsyncErrorHandler(AuthMiddleware),
  AsyncErrorHandler(feedController.delete)
);

router.get(
  "/my",
  AsyncErrorHandler(AuthMiddleware),
  AsyncErrorHandler(feedController.myFeeds)
);

router.get("/:id", AsyncErrorHandler(feedController.singleFeed));

export { router as feedRouter };
