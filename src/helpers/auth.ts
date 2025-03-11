import { IAuthHelper } from "@/types/helpers";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";

export class AuthHelper implements IAuthHelper {
  signToken(payload: JwtPayload, secret: string, options: SignOptions): string {
    return jwt.sign(payload, secret, options);
  }

  verifyToken(token: string, secret: string): string | JwtPayload {
    return jwt.verify(token, secret);
  }

  async signHash(data: string): Promise<string> {
    const salt = bcrypt.genSaltSync(12);
    return await bcrypt.hash(data, salt);
  }

  async verifyHash(data: string, hashData: string): Promise<boolean> {
    return await bcrypt.compare(data, hashData);
  }
}

export const authHelper = new AuthHelper();
