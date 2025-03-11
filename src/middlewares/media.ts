import { AppRequest } from "@/types";
import multer, { StorageEngine } from "multer";
import path from "path";

// Define storage configuration
const createStorage = (destination: string): StorageEngine =>
  multer.diskStorage({
    destination: (_req: AppRequest, _file: Express.Multer.File, cb) => {
      cb(null, destination);
    },
    filename: (_req: AppRequest, file: Express.Multer.File, cb) => {
      cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
  });

// Middleware for image uploads (Max 1MB)
export const picMiddleware = multer({
  storage: createStorage("public/"),
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
});

// Middleware for MP4 uploads (Max 50MB)
export const mp4Middleware = multer({
  storage: createStorage("public/"),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});
