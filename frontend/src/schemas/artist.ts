import { z } from "zod";

export const artistSchema = z.object({
  name: z
    .string()
    .min(1, "Artist name is required")
    .max(100, "Artist name must be less than 100 characters"),
  bio: z
    .string()
    .min(1, "Bio is required")
    .max(1000, "Bio must be less than 1000 characters")
    .optional(),
});
