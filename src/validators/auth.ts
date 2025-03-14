import * as z from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     SignUpInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: test@gmail.com
 *         password:
 *           type: string
 *           format: password
 *           example: password123
 */
export const signUpSchema = z.object({
  name: z.string({ required_error: "name is required" }),
  email: z
    .string({ required_error: "email is required" })
    .email({ message: "invalid is required" }),
  phone: z
    .string({ required_error: "phone is required" })
    .min(10, { message: "phone must be 10 character" })
    .max(10, { message: "phone must be 10 character" }),
  password: z
    .string({ required_error: "password is required" })
    .min(8, { message: "password must be 8 character" })
    .max(30, { message: "password must be 30 character" }),
});
/**
 * @openapi
 * components:
 *   schemas:
 *     SignInInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: test@gmail.com
 *         password:
 *           type: string
 *           format: password
 *           example: password123
 */
export const signInSchema = z.object({
  email: z
    .string({ required_error: "email is required" })
    .email({ message: "invalid is required" }),
  password: z
    .string({ required_error: "password is required" })
    .min(8, { message: "password must be 8 character" })
    .max(30, { message: "password must be 30 character" }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     ResetPasswordInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         otp:
 *           type: string
 *           format: string
 *           example: 123456
 *         password:
 *           type: string
 *           format: password
 *           example: password123
 */
export const resetPasswordSchema = z.object({
  otp: z.string({ required_error: "otp is required" }),
  password: z
    .string({ required_error: "password is required" })
    .min(8, { message: "password must be 8 character" })
    .max(30, { message: "password must be 30 character" }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     ChangePasswordInput:
 *       type: object
 *       required:
 *         - password
 *       properties:
 *         password:
 *           type: string
 *           format: password
 *           example: password123
 */
export const changePasswordSchema = z.object({
  password: z
    .string({ required_error: "password is required" })
    .min(8, { message: "password must be 8 character" })
    .max(30, { message: "password must be 30 character" }),
});
