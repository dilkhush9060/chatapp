-- CreateTable
CREATE TABLE "feeds" (
    "id" TEXT NOT NULL,
    "image" TEXT,
    "imageUrl" TEXT,
    "text" TEXT,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "feeds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reels" (
    "id" TEXT NOT NULL,
    "video" TEXT,
    "videoUrl" TEXT,
    "caption" TEXT,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "reels_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "feeds" ADD CONSTRAINT "feeds_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reels" ADD CONSTRAINT "reels_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
