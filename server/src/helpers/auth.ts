import { IAuthHelper } from "@/types/helpers";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import * as argon from "argon2";

export class AuthHelper implements IAuthHelper {
  signToken(payload: JwtPayload, secret: string, options: SignOptions): string {
    return jwt.sign(payload, secret, options);
  }

  verifyToken(token: string, secret: string): string | JwtPayload {
    return jwt.verify(token, secret);
  }

  async signHash(data: string): Promise<string> {
    return await argon.hash(data);
  }

  async verifyHash(data: string, hashData: string): Promise<boolean> {
    return await argon.verify(hashData, data);
  }
}

export const authHelper = new AuthHelper();
