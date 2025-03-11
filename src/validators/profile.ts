import * as z from "zod";

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
