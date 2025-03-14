import * as z from "zod";

export const feedSchema = z.object({
  text: z.string({ required_error: "text is required" }),
});
