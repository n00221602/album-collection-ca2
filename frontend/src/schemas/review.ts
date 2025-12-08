import { z } from "zod";

export const reviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(0, "Rating must be at least 0")
    .max(10, "Rating must be at most 10"),
  comment: z
    .string()
    .min(1, "Comment is required")
    .max(500, "Comment must be less than 500 characters")
    .optional(),
  albumId: z.string().min(1, "Album ID is required"),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
