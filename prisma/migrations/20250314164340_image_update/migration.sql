/*
  Warnings:

  - You are about to drop the column `image` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "image",
DROP COLUMN "imageUrl",
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "profileImageUrl" TEXT;
