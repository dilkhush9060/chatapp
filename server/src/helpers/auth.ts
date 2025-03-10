import { IAuthHelper } from "@/types/helpers";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";

export class AuthHelper implements IAuthHelper {
  signToken(payload: JwtPayload, secret: string, options: SignOptions): string {
    return jwt.sign(payload, secret, options);
  }

  verifyToken(token: string, secret: string): string | JwtPayload {
    return jwt.verify(token, secret);
  }

  signHash(data: string): string {
    const salt = bcrypt.genSaltSync(12);
    return bcrypt.hashSync(data, salt);
  }

  verifyHash(data: string, hashData: string): boolean {
    return bcrypt.compareSync(data, hashData);
  }
}

export const authHelper = new AuthHelper();
