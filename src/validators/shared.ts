import * as z from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     EmailInput:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: test@gmail.com
 */
export const emailSchema = z.object({
  email: z
    .string({ required_error: "email is required" })
    .email({ message: "invalid is required" }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     OTPInput:
 *       type: object
 *       required:
 *         - otp
 *       properties:
 *         otp:
 *           type: string
 *           format: string
 *           example: 123456
 */
export const otpSchema = z.object({
  otp: z.string({ required_error: "otp is required" }),
});
