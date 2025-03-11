import { HttpError, myEnvironment } from "@/configs";
import { prisma } from "@/database";
import { authHelper, otpHelper } from "@/helpers";
import { AppNextFunction, AppRequest, AppResponse } from "@/types";
import {
  signUpSchema,
  emailSchema,
  otpSchema,
  signInSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "@/validators";

class AuthController {
  // sing up
  signUp = async (req: AppRequest, res: AppResponse, next: AppNextFunction) => {
    // data validation
    const { success, data, error } = signUpSchema.safeParse(req.body);
    if (!success) {
      return next(error);
    }

    // check user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });
    if (existingUser) {
      return next(new HttpError("account already exists", 400));
    }

    // hash password
    const hashPassword = await authHelper.signHash(data.password);

    // generate otp
    const otp = otpHelper.generateOTP();

    // generate token
    const token = authHelper.signToken(
      { email: data.email },
      myEnvironment.TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // create user
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashPassword,
        otp,
        token,
      },
    });

    // TODO:send mail

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60,
    });

    // send response
    res.status(201).json({
      statusCode: 201,
      status: true,
      message: "account created",
      data: { token },
    });
  };

  // send verification email
  sendVerificationMail = async (
    req: AppRequest,
    res: AppResponse,
    next: AppNextFunction
  ) => {
    // data validation
    const { error, success, data } = emailSchema.safeParse(req.body);
    if (!success) {
      return next(error);
    }

    //check user existing
    const user = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      return next(new HttpError("account not exists", 404));
    }

    if (user.isVerified) {
      return next(new HttpError("account already verified", 400));
    }

    // generate otp
    const otp = otpHelper.generateOTP();

    // generate token
    const token = authHelper.signToken(
      { email: data.email },
      myEnvironment.TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // update user
    await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        otp,
        token,
      },
    });

    //TODO: send mail

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60,
    });

    return res.status(200).json({
      statusCode: 200,
      status: true,
      message: "please check your email",
      data: {
        token,
      },
    });
  };

  // verify account
  verifyMail = async (
    req: AppRequest,
    res: AppResponse,
    next: AppNextFunction
  ) => {
    // data validation
    const { error, success, data } = otpSchema.safeParse(req.body);
    if (!success) {
      return next(error);
    }

    const tokenData = req.tokenData as { email: string };

    //check user existing
    const user = await prisma.user.findFirst({
      where: {
        email: tokenData.email,
        token: req.token,
      },
    });

    if (!user) {
      return next(new HttpError("account not exists", 400));
    }

    if (user.isVerified) {
      return next(new HttpError("account already verified", 400));
    }
    // check otp
    if (user.otp != data.otp) {
      return next(new HttpError("invalid otp", 400));
    }
    // update user
    await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        isVerified: true,
        otp: null,
        token: null,
      },
    });

    //TODO: send mail

    // set cookie
    res.cookie("token", null, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000,
    });

    return res.status(200).json({
      statusCode: 200,
      status: true,
      message: "account verified successfully",
    });
  };

  // sign in
  signIn = async (req: AppRequest, res: AppResponse, next: AppNextFunction) => {
    //data validation
    const { success, data, error } = signInSchema.safeParse(req.body);
    if (!success) {
      return next(error);
    }

    //check user existing
    const user = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      return next(new HttpError("account not exists", 404));
    }

    // account verification
    if (user.isVerified === false) {
      return next(new HttpError("account not verified", 400));
    }

    // password match
    const isMatch = await authHelper.verifyHash(data.password, user.password);

    if (!isMatch) {
      return next(new HttpError("invalid credentials", 400));
    }

    // generate token
    const accessToken = authHelper.signToken(
      { name: user.name, email: user.email },
      myEnvironment.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );
    const token = authHelper.signToken(
      { email: data.email },
      myEnvironment.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // update user
    await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        token,
      },
    });

    // set cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.cookie("refreshToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 3,
    });

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "signin successful",
      data: {
        accessToken,
        refreshTone: token,
      },
    });
  };

  // forget password
  forgetPassword = async (
    req: AppRequest,
    res: AppResponse,
    next: AppNextFunction
  ) => {
    //data validation
    const { success, data, error } = emailSchema.safeParse(req.body);
    if (!success) {
      return next(error);
    }

    //check user existing
    const user = await prisma.user.findFirst({
      where: {
        email: data.email,
        token: req.token,
      },
    });
    if (!user) {
      return next(new HttpError("account not exists", 404));
    }

    // account verification
    if (user.isVerified === false) {
      return next(new HttpError("account not verified", 400));
    }

    // generate token
    const token = authHelper.signToken(
      { email: data.email },
      myEnvironment.TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // generate otp
    const otp = otpHelper.generateOTP();

    // update user
    await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        otp,
        token,
      },
    });

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60,
    });

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "please check email",
      data: {
        token,
      },
    });
  };

  // reset password
  resetPassword = async (
    req: AppRequest,
    res: AppResponse,
    next: AppNextFunction
  ) => {
    //data validation
    const { success, data, error } = resetPasswordSchema.safeParse(req.body);
    if (!success) {
      return next(error);
    }

    const tokenData = req.tokenData as { email: string };

    //check user existing
    const user = await prisma.user.findFirst({
      where: {
        email: tokenData.email,
        token: req.token,
      },
    });

    if (!user) {
      return next(new HttpError("account not exists", 404));
    }

    // check otp
    if (user.otp != data.otp) {
      return next(new HttpError("invalid otp", 400));
    }

    // hash password
    const hashPassword = await authHelper.signHash(data.password);

    // update user
    await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        password: hashPassword,
        otp: null,
        token: null,
      },
    });

    // set cookie
    res.cookie("token", null, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000,
    });

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "password reset successful",
    });
  };

  // change password
  changePassword = async (
    req: AppRequest,
    res: AppResponse,
    next: AppNextFunction
  ) => {
    //data validation
    const { success, data, error } = changePasswordSchema.safeParse(req.body);
    if (!success) {
      return next(error);
    }

    //check user existing
    const existing = await prisma.user.findFirst({
      where: {
        email: req.user?.email,
      },
    });

    if (!existing) {
      return next(new HttpError("account not exists", 404));
    }

    // hash password
    const hashPassword = await authHelper.signHash(data.password);

    // update user
    await prisma.user.update({
      where: {
        email: existing.email,
      },
      data: {
        password: hashPassword,
        otp: null,
        token: null,
      },
    });

    // set cookie
    res.cookie("accessToken", null, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000,
    });
    res.cookie("refreshToken", null, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000,
    });
    res.cookie("token", null, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000,
    });

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "password change successful",
    });
  };
}

export const authController = new AuthController();
