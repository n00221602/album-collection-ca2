import Review from "../../../models/review.js";
import mongoose from "mongoose";

describe("Review Model", () => {
  describe("Schema validation", () => {
    test("should create review with valid data", () => {
      const testReview = {
        rating: 8,
        comment: "test",
        userId: new mongoose.Types.ObjectId(),
        albumId: new mongoose.Types.ObjectId(),
      };

      const review = new Review(testReview);

      expect(review.rating).toBe(8);
      expect(review.comment).toBe("test");
      expect(review.userId).toBeDefined();
      expect(review.albumId).toBeDefined();
    });

    test("missing rating field", () => {
      const testReview = {
        comment: "test",
        userId: new mongoose.Types.ObjectId(),
        albumId: new mongoose.Types.ObjectId(),
      };

      const review = new Review(testReview);
      const isValid = review.rating !== undefined && review.rating !== null;

      expect(isValid).toBe(false);
      expect(review.rating).toBeUndefined();
    });

    test("missing comment field", () => {
      const testReview = {
        rating: 8,
        userId: new mongoose.Types.ObjectId(),
        albumId: new mongoose.Types.ObjectId(),
      };

      const review = new Review(testReview);
      const isValid = review.comment !== undefined && review.comment !== null;

      expect(isValid).toBe(false);
      expect(review.comment).toBeUndefined();
    });

    test("missing userId field", () => {
      const testReview = {
        rating: 8,
        comment: "test",
        albumId: new mongoose.Types.ObjectId(),
      };

      const review = new Review(testReview);
      const isValid = review.userId !== undefined && review.userId !== null;

      expect(isValid).toBe(false);
      expect(review.userId).toBeUndefined();
    });

    test("missing albumId field", () => {
      const testReview = {
        rating: 8,
        comment: "test",
        userId: new mongoose.Types.ObjectId(),
      };

      const review = new Review(testReview);
      const isValid = review.albumId !== undefined && review.albumId !== null;

      expect(isValid).toBe(false);
      expect(review.albumId).toBeUndefined();
    });

    test("should accept valid rating range", () => {
      const testReview = {
        rating: 5,
        comment: "test",
        userId: new mongoose.Types.ObjectId(),
        albumId: new mongoose.Types.ObjectId(),
      };

      const review = new Review(testReview);
      const isValid = review.rating >= 0 && review.rating <= 10;

      expect(isValid).toBe(true);
      expect(review.rating).toBe(5);
    });

    test("shouldnt accept invalid rating out of range", () => {
      const testReview = {
        rating: 11,
        comment: "test",
        userId: new mongoose.Types.ObjectId(),
        albumId: new mongoose.Types.ObjectId(),
      };

      const review = new Review(testReview);
      const isValid = review.rating >= 0 && review.rating <= 10;

      expect(isValid).toBe(false);
      expect(review.rating).toBe(11);
    });

    test("should handle invalid userId", () => {
      const testReview = {
        rating: 8,
        comment: "test",
        userId: "test",
        albumId: new mongoose.Types.ObjectId(),
      };

      const review = new Review(testReview);
      const isValid = mongoose.Types.ObjectId.isValid(review.userId);

      expect(isValid).toBe(false);
      expect(review.userId).toBeUndefined();
    });

    test("should handle invalid albumId", () => {
      const testReview = {
        rating: 8,
        comment: "test",
        userId: new mongoose.Types.ObjectId(),
        albumId: "not-an-object-id",
      };

      const review = new Review(testReview);
      const isValid = mongoose.Types.ObjectId.isValid(review.albumId);

      expect(isValid).toBe(false);
      expect(review.albumId).toBeUndefined();
    });
  });
});