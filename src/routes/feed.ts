import { AsyncErrorHandler } from "@/configs";
import { feedController } from "@/controllers";
import { AuthMiddleware, picMiddleware } from "@/middlewares";
import { Router } from "express";

const router = Router();

/**
 * @openapi
 * /feeds:
 *   post:
 *     summary: Create a new feed
 *     description: Create a new feed with optional media file upload.
 *     tags:
 *       - Feeds
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Optional media file to upload.
 *               content:
 *                 type: string
 *                 example: "This is a new feed post."
 *     responses:
 *       201:
 *         description: Feed created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Feed created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Feed'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid input data
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized access
 */
router.post(
  "/",
  AsyncErrorHandler(AuthMiddleware),
  AsyncErrorHandler(picMiddleware.single("file")),
  AsyncErrorHandler(feedController.create)
);

/**
 * @openapi
 * /feeds:
 *   get:
 *     summary: Get all feeds
 *     description: Retrieve a list of all feeds.
 *     tags:
 *       - Feeds
 *     responses:
 *       200:
 *         description: List of all feeds retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Feed'
 */
router.get("/", AsyncErrorHandler(feedController.listAll));

/**
 * @openapi
 * /feeds/{id}:
 *   patch:
 *     summary: Update a feed
 *     description: Update the content of a specific feed by ID.
 *     tags:
 *       - Feeds
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the feed to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Updated feed content."
 *     responses:
 *       200:
 *         description: Feed updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Feed updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Feed'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid input data
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized access
 *       404:
 *         description: Feed not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Feed not found
 */
router.patch(
  "/:id",
  AsyncErrorHandler(AuthMiddleware),
  AsyncErrorHandler(feedController.update)
);

/**
 * @openapi
 * /feeds/{id}:
 *   delete:
 *     summary: Delete a feed
 *     description: Delete a specific feed by ID.
 *     tags:
 *       - Feeds
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the feed to delete.
 *     responses:
 *       200:
 *         description: Feed deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Feed deleted successfully
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized access
 *       404:
 *         description: Feed not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Feed not found
 */
router.delete(
  "/:id",
  AsyncErrorHandler(AuthMiddleware),
  AsyncErrorHandler(feedController.delete)
);

/**
 * @openapi
 * /feeds/my:
 *   get:
 *     summary: Get my feeds
 *     description: Retrieve all feeds created by the authenticated user.
 *     tags:
 *       - Feeds
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's feeds retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Feed'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized access
 */
router.get(
  "/my",
  AsyncErrorHandler(AuthMiddleware),
  AsyncErrorHandler(feedController.myFeeds)
);

/**
 * @openapi
 * /feeds/{id}:
 *   get:
 *     summary: Get a specific feed
 *     description: Retrieve a specific feed by ID.
 *     tags:
 *       - Feeds
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the feed to retrieve.
 *     responses:
 *       200:
 *         description: Feed retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Feed'
 *       404:
 *         description: Feed not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Feed not found
 */
router.get("/:id", AsyncErrorHandler(feedController.singleFeed));

export { router as feedRouter };
