import { myEnvironment, HttpError } from "@/configs";
import { authHelper } from "@/helpers";
import { AppNextFunction, AppRequest, AppResponse } from "@/types";

// auth middleware
export const AuthMiddleware = (
  request: AppRequest,
  _response: AppResponse,
  next: AppNextFunction
) => {
  // get token from user  side
  const token =
    request.headers.authorization?.split(" ")[1] ||
    (request.cookies as Record<string, string>)?.accessToken;
  // check proper  toke exists
  if (!token) {
    return next(new HttpError("unauthorized | token not found", 401));
  }
  // decode the token data
  const decoded =
    (authHelper.verifyToken(token, myEnvironment.ACCESS_TOKEN_SECRET) as {
      id: string;
      role: string;
      email: string;
      name: string;
      phone: string;
    }) || undefined;

  // check decode error
  if (!decoded) {
    return next(new HttpError("unauthorized | invalid token", 401));
  }
  //set current user
  request.user = decoded as Express.User;

  return next();
};

// token middleware
export const TokenMiddleware = (
  request: AppRequest,
  _response: AppResponse,
  next: AppNextFunction
) => {
  // get token from user  side
  const token =
    request.headers.authorization?.split(" ")[1] ||
    (request.cookies as Record<string, string>)?.accessToken;
  // check proper  toke exists
  if (!token) {
    return next(new HttpError("unauthorized | token not found", 401));
  }
  // decode the token data
  const decoded =
    (authHelper.verifyToken(token, myEnvironment.TOKEN_SECRET) as {
      id: string;
      role: string;
      email: string;
      name: string;
      phone: string;
    }) || undefined;

  // check decode error
  if (!decoded) {
    return next(new HttpError("unauthorized | invalid token", 401));
  }
  //set current token data
  request.tokenData = decoded;
  // return next handle
  return next();
};

// refresh token middleware
export const RefreshTokenMiddleware = (
  request: AppRequest,
  _response: AppResponse,
  next: AppNextFunction
) => {
  // get token from user  side
  const token =
    request.headers.authorization?.split(" ")[1] ||
    (request.cookies as Record<string, string>)?.accessToken;
  // check proper  toke exists
  if (!token) {
    return next(new HttpError("unauthorized | token not found", 401));
  }
  // decode the token data
  const decoded =
    (authHelper.verifyToken(token, myEnvironment.REFRESH_TOKEN_SECRET) as {
      id: string;
      role: string;
      email: string;
      name: string;
      phone: string;
    }) || undefined;

  // check decode error
  if (!decoded) {
    return next(new HttpError("unauthorized | invalid token", 401));
  }
  //set current token data
  request.tokenData = decoded;

  return next();
};

// admin middleware
export const AdminMiddleware = (
  request: AppRequest,
  _response: AppResponse,
  next: AppNextFunction
) => {
  // get current user
  const user = request.user;
  // check user role admin
  if (user?.role !== "admin") {
    return next(new HttpError("Access denied", 401));
  }

  return next();
};
