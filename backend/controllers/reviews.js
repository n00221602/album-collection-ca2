import { Router } from "express";
import Review from "../models/review.js";
import { reviewSchema, reviewIdSchema } from "../utils/validators.js";
import { HttpError, NOT_FOUND, BAD_REQUEST } from "../utils/HttpError.js";
import { validate } from "../middleware/validateRequest.js";
import { requireAuth } from "../middleware/auth.js";
import Artist from "../models/artist.js";

//const SUCCESS_NO_CONTENT = 204;

const reviewRouter = Router();

// Get all reviews for the logged-in user
reviewRouter.get("/", requireAuth, async (req, res) => {
  const reviews = await Review.find({ userId: req.session.userId}).exec();
  if (!reviews) {
      throw new HttpError(NOT_FOUND, "Could not find reviews");
    }
  res.json(reviews);
});

// Get single review by ID
reviewRouter.get("/:id", requireAuth, validate(reviewIdSchema), async (req, res) => {
    //Review can only be viewed by the user who created it
    const review = await Review.findOne({
      _id: req.params.id,
      userId: req.session.userId
    }).exec();


    //Adding album info to the review
    const artist = await Artist.findOne({ "releases._id": review.albumId }).exec();
    const albumInfo = {
      title: artist.releases.id(review.albumId).title,
      artist: artist.name,
      genre: artist.releases.id(review.albumId).genre,
      year: artist.releases.id(review.albumId).year
    };

    if (!review) {
      throw new HttpError(NOT_FOUND, "Could not find review");
    }

    res.json({ review, albumInfo });
  }
);

// Create new review
reviewRouter.post("/", requireAuth, validate(reviewSchema), async (req, res) => {
    const { rating, comment, albumId } = req.body;

    //Check if the user has already reviewed the album
    const existingReview = await Review.findOne({
      albumId: albumId,
      userId: req.session.userId
    }).exec();

    if (existingReview) {
      throw new HttpError(BAD_REQUEST, "You have already reviewed this album");
    }

    // Associate review with the logged-in user
    const review = await Review.create({
      rating,
      comment,
      albumId,
      userId: req.session.userId,
    });

    res.status(201).json(review);
  }
);

// Update review
reviewRouter.put("/:id", requireAuth, validate(reviewIdSchema), validate(reviewSchema), async (req, res) => {
    const { rating, comment } = req.body;

    const review = await Review.findOneAndUpdate(
      {
        _id: req.params.id,
         userId: req.session.userId
      },
      {
        rating,
        comment,
      },
      { new: true }
    ).exec();

    if (!review) {
      throw new HttpError(NOT_FOUND, "Could not find review");
    }

    res.json(review);
  }
);

// Delete review
reviewRouter.delete("/:id", requireAuth, validate(reviewIdSchema), async (req, res) => {
    // Only delete review if it belongs to the logged-in user
    const result = await Review.findOneAndDelete({
      _id: req.params.id,
      userId: req.session.userId
    }).exec();

    if (!result) {
      throw new HttpError(NOT_FOUND, "Could not find review");
    }

    res.status(200).json({ message: "Review deleted successfully" })
  }
);

export default reviewRouter;
