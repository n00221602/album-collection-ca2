import { z } from "zod";

export const artistSchema = z.object({
  name: z
    .string()
    .min(2, "Artist name must be at least 2 characters")
    .max(100, "Artist name must be less than 100 characters"),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(1000, "Bio must be less than 1000 characters")
    .optional(),
});
