import { z } from "zod";

export const albumSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  genre: z.array(z.string()).min(1, "At least one genre is required"),
  year: z
    .number()
    .int()
    .min(1900, "Year must be within range")
    .max(2025, "Year must be within range"),
    artistId: z.string().min(1, "Artist ID is required"),
});

export type AlbumInput = z.infer<typeof albumSchema>;
