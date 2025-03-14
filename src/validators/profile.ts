import * as z from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     ProfileInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: test@gmail.com
 *         phone:
 *           type: string
 *           format: string
 *           example: 9060444206
 */
export const profileSchema = z.object({
  name: z.string({ required_error: "name is required" }),
  email: z
    .string({ required_error: "email is required" })
    .email({ message: "invalid is required" }),
  phone: z
    .string({ required_error: "phone is required" })
    .min(10, { message: "phone must be 10 character" })
    .max(10, { message: "phone must be 10 character" }),
});
