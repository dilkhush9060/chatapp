import { HttpError } from "@/configs";
import { prisma } from "@/database";
import { AppNextFunction, AppRequest, AppResponse } from "@/types";
import { feedSchema } from "@/validators";
import fs from "node:fs";

class FeedController {
  // create feed
  create = async (req: AppRequest, res: AppResponse, next: AppNextFunction) => {
    // auth user
    const user = req.user as Express.User;

    // file
    const file = req.file;

    // data validation
    const { success, data, error } = feedSchema.safeParse(req.body);
    if (!success) {
      return next(error);
    }

    const feed = await prisma.feed.create({
      data: {
        text: data.text,
        image: file?.filename,
        imageUrl: `http://localhost:5000/${file?.filename}`,
        authorId: user.id,
      },
    });

    res
      .status(201)
      .json({ statusCode: 201, message: "feed created", data: { feed } });
  };

  // list all feed
  listAll = async (
    _req: AppRequest,
    res: AppResponse,
    next: AppNextFunction
  ) => {
    const feeds = await prisma.feed.findMany({
      include: {
        author: {
          select: {
            name: true,
            profileImage: true,
            profileImageUrl: true,
          },
        },
      },
    });

    if (feeds.length === 0) {
      return next(new HttpError("feeds not found", 404));
    }

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "feed fetched",
      data: { feeds },
    });
  };

  // update feed
  update = async (req: AppRequest, res: AppResponse, next: AppNextFunction) => {
    const { id } = req.params;
    // auth user
    const user = req.user as Express.User;

    // data validation
    const { success, data, error } = feedSchema.safeParse(req.body);
    if (!success) {
      return next(error);
    }
    // find feed
    const feed = await prisma.feed.findFirst({
      where: {
        id: id,
        authorId: user.id,
      },
    });

    // find feed error
    if (!feed) {
      return next(new HttpError("feed not found", 404));
    }
    // update feed
    const updatedFeed = await prisma.feed.update({
      where: {
        id: feed.id,
      },
      data: {
        text: data.text,
      },
    });

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "feed updated",
      data: { feed: updatedFeed },
    });
  };

  // delete feed
  delete = async (req: AppRequest, res: AppResponse, next: AppNextFunction) => {
    const { id } = req.params;
    // auth user
    const user = req.user as Express.User;

    // find feed
    const feed = await prisma.feed.findFirst({
      where: {
        id: id,
        authorId: user.id,
      },
    });

    // find feed error
    if (!feed) {
      return next(new HttpError("feed not found", 404));
    }

    // delete image
    if (feed.image) {
      // delete logic
      fs.unlinkSync(`public/${feed.image}`);
    }

    // delete feed
    await prisma.feed.delete({
      where: {
        id: feed.id,
      },
    });

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "feed deleted",
    });
  };

  // get feed
  singleFeed = async (
    req: AppRequest,
    res: AppResponse,
    next: AppNextFunction
  ) => {
    const { id } = req.params;

    // find feed
    const feed = await prisma.feed.findFirst({
      where: {
        id: id,
      },
      include: {
        author: {
          select: {
            name: true,
            profileImage: true,
            profileImageUrl: true,
          },
        },
      },
    });

    // find feed error
    if (!feed) {
      return next(new HttpError("feed not found", 404));
    }

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "feed fetched",
      data: { feed },
    });
  };

  // my feeds
  myFeeds = async (
    req: AppRequest,
    res: AppResponse,
    next: AppNextFunction
  ) => {
    // auth user
    const user = req.user as Express.User;

    // find feeds
    const feeds = await prisma.feed.findMany({
      where: {
        authorId: user.id,
      },
    });

    // find feeds error
    if (feeds.length == 0) {
      return next(new HttpError("feed not found", 404));
    }

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "my feeds",
      data: { feeds },
    });
  };
}

export const feedController = new FeedController();
