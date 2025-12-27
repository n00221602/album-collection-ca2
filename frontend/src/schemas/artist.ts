import { z } from "zod";

export const artistSchema = z.object({
  name: z
    .string()
    .min(1, "Artist name is required")
    .max(100, "Artist name must be less than 100 characters"),
  releases: z.array(
    z.object({
      title: z
        .string()
        .min(1, "Album title is required")
        .max(100, "Album title must be less than 100 characters"),
      genre: z
        .array(z.string()
          .min(1, "At least one genre is required")
          .max(30, "Genres must be less than 30 characters"),
        ),
      year: z
        .number()
        .int()
        .min(1900, "Year must be within range")
        .max(2025, "Year must be within range"),
    })
  ),
  bio: z
    .string()
    .min(1, "Bio is required")
    .max(1000, "Bio must be less than 1000 characters"),
});

export type ArtistInput = z.infer<typeof artistSchema>;