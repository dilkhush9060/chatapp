import * as z from "zod";

export const emailSchema = z.object({
  email: z
    .string({ required_error: "email is required" })
    .email({ message: "invalid is required" }),
});

export const otpSchema = z.object({
  otp: z.string({ required_error: "otp is required" }),
});
