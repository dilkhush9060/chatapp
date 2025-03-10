import { HttpError } from "@/configs";
import { prisma } from "@/database";
import { AppNextFunction, AppRequest, AppResponse } from "@/types";

class ProfileController {
  // get profile
  getProfile = async (
    req: AppRequest,
    res: AppResponse,
    next: AppNextFunction
  ) => {
    const userData = req.user;

    // check profile
    const profile = await prisma.user.findFirst({
      where: {
        email: userData?.email,
      },
    });

    if (!profile) {
      return next(new HttpError("profile not found", 400));
    }

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "profile found",
      data: {
        profile: {
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          image: profile.image,
        },
      },
    });
  };

  // update profile
}

export const profileController = new ProfileController();
