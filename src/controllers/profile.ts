import { prisma } from "@/database";
import { HttpError } from "@/configs";
import { profileSchema } from "@/validators";
import { AppNextFunction, AppRequest, AppResponse } from "@/types";
import fs from "node:fs";

class ProfileController {
  // get profile
  getProfile = async (
    req: AppRequest,
    res: AppResponse,
    next: AppNextFunction
  ) => {
    const userData = req.user;

    if (!userData) {
      return next(new HttpError("Unauthorized access", 401));
    }

    const profile = await prisma.user.findUnique({
      where: { email: userData.email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profileImage: true,
        profileImageUrl: true,
        isVerified: true,
        followers: {
          select: {
            follower: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImageUrl: true,
              },
            },
          },
        },
        following: {
          select: {
            following: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImageUrl: true,
              },
            },
          },
        },
      },
    });

    if (!profile) {
      return next(new HttpError("Profile not found", 404));
    }

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Profile found",
      data: {
        profile,
        followers: profile.followers.map((f) => f.follower),
        following: profile.following.map((f) => f.following),
      },
    });
  };

  // update profile
  updateProfile = async (
    req: AppRequest,
    res: AppResponse,
    next: AppNextFunction
  ) => {
    const userData = req.user;
    // data validation
    const { success, data, error } = profileSchema.safeParse(req.body);
    if (!success) {
      return next(error);
    }

    // check profile
    const profile = await prisma.user.findFirst({
      where: {
        email: userData?.email,
      },
    });

    if (!profile) {
      return next(new HttpError("profile not found", 404));
    }

    const updatedProfile = await prisma.user.update({
      where: {
        email: profile.email,
      },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
    });

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "profile updated",
      data: {
        profile: {
          id: updatedProfile.id,
          name: updatedProfile.name,
          email: updatedProfile.email,
          phone: updatedProfile.phone,
          profileImageUrl: updatedProfile.profileImageUrl,
        },
      },
    });
  };

  // upload profile picture
  updateProfilePicture = async (
    req: AppRequest,
    res: AppResponse,
    next: AppNextFunction
  ) => {
    const userData = req.user;
    const file = req.file;

    if (!file) {
      return next(new HttpError("please select a file", 400));
    }

    // check profile
    const profile = await prisma.user.findFirst({
      where: {
        email: userData?.email,
      },
    });

    if (!profile) {
      return next(new HttpError("profile not found", 404));
    }

    if (profile.profileImage) {
      // delete logic
      fs.unlinkSync(`public/${profile.profileImage}`);
    }

    const updatedProfile = await prisma.user.update({
      where: {
        email: profile.email,
      },
      data: {
        profileImage: file.filename,
        profileImageUrl: `http://localhost:5000/${file.filename}`,
      },
    });

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "profile updated",
      data: {
        profile: {
          id: updatedProfile.id,
          name: updatedProfile.name,
          email: updatedProfile.email,
          phone: updatedProfile.phone,
          profileImage: updatedProfile.profileImage,
          profileImageUrl: updatedProfile.profileImageUrl,
        },
      },
    });
  };

  //all profile
  getAllProfiles = async (
    _req: AppRequest,
    res: AppResponse,
    next: AppNextFunction
  ) => {
    // check profile
    const profiles = await prisma.user.findMany({
      where: {
        isVerified: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profileImageUrl: true,
        isVerified: true,
        profileImage: true,
      },
    });

    if (profiles.length === 0) {
      return next(new HttpError("profiles not found", 404));
    }

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "profiles found",
      data: {
        profiles,
      },
    });
  };

  //single profile
  getSingleProfile = async (
    req: AppRequest,
    res: AppResponse,
    next: AppNextFunction
  ) => {
    const { id } = req.params;

    // Fetch profile + followers + following in a single query
    const profile = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profileImage: true,
        profileImageUrl: true,
        isVerified: true,
        followers: {
          select: {
            follower: {
              select: {
                id: true,
              },
            },
          },
        },
        following: {
          select: {
            following: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!profile) {
      return next(new HttpError("Profile not found", 404));
    }

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Profile found",
      data: {
        profile,
        followers: profile.followers.map((f) => f.follower), // Extract followers
        following: profile.following.map((f) => f.following), // Extract following
      },
    });
  };

  // toggle follow
  toggleFollow = async (
    req: AppRequest,
    res: AppResponse,
    next: AppNextFunction
  ) => {
    const { id: followingId } = req.params;
    const userData = req.user as Express.User;
    const followerId = userData.id;

    if (!followingId || !followerId) {
      return next(new HttpError("User ID is required", 400));
    }

    if (followerId === followingId) {
      return next(new HttpError("Self-following is not allowed", 400));
    }

    // Check if the user is already following
    const existingFollow = await prisma.userFollow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });

    if (existingFollow) {
      // Unfollow user
      await prisma.userFollow.delete({
        where: { followerId_followingId: { followerId, followingId } },
      });
      return res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Unfollowed successfully",
        data: { followingId },
      });
    } else {
      // Follow user
      await prisma.userFollow.create({
        data: { followerId, followingId },
      });
      return res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Followed successfully",
        data: { followingId },
      });
    }
  };
}

export const profileController = new ProfileController();
