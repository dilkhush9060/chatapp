import * as crypto from "crypto";

export class OTPHelper {
  private readonly otpLength: number = 6;

  public generateOTP(): string {
    const randomBytes = crypto.randomBytes(Math.ceil(this.otpLength / 2));
    const otp = parseInt(randomBytes.toString("hex"), 16)
      .toString()
      .slice(0, this.otpLength)
      .padStart(this.otpLength, "0");
    return otp;
  }

  public async verifyOTP(otp: string, value: string): Promise<boolean> {
    const isValid = value === otp;
    return isValid;
  }
}

export const otpHelper = new OTPHelper();
