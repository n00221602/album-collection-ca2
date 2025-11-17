import { Router } from "express";
import Artist from "../models/artist.js";
import { artistSchema, artistIdSchema } from "../utils/validators.js";
import { HttpError, NOT_FOUND } from "../utils/HttpError.js";
import { validate } from "../middleware/validateRequest.js";
import { requireAdmin } from "../middleware/auth.js";

const SUCCESS_NO_CONTENT = 204;

const artistRouter = Router();

// Get all artists for the logged-in user
artistRouter.get("/", async (req, res) => {
  const artists = await Artist.find().exec();
  res.json(artists);
});

// Get single artist by ID
artistRouter.get(
  "/:id",
  validate(artistIdSchema),
  async (req, res) => {
    //Artist can be viewed by any authenticated user
    const artist = await Artist.findOne({
      _id: req.params.id,
    }).exec();

    if (!artist) {
      throw new HttpError(NOT_FOUND, "Could not find artist");
    }

    res.json(artist);
  }
);

// Create new artist
artistRouter.post(
  "/",
  requireAdmin,
  validate(artistSchema),
  async (req, res) => {
    const { name, releases, bio } = req.body;

    // Associate artist with the logged-in user
    const artist = await Artist.create({
      name,
      releases,
      bio,
    });

    res.status(201).json(artist);
  }
);

// Update artist
artistRouter.put(
  "/:id",
  requireAdmin,
  validate(artistIdSchema),
  validate(artistSchema),
  async (req, res) => {
    const { name, releases, bio } = req.body;

    const artist = await Artist.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        name,
        releases,
        bio,
      },
      { new: true }
    ).exec();

    if (!artist) {
      throw new HttpError(NOT_FOUND, "Could not find artist");
    }

    res.json(artist);
  }
);

// Delete artist
artistRouter.delete(
  "/:id",
  requireAdmin,
  validate(artistIdSchema),
  async (req, res) => {
    // Only delete artist if it belongs to the logged-in user
    const result = await Artist.findOneAndDelete({
      _id: req.params.id,
    }).exec();

    if (!result) {
      throw new HttpError(NOT_FOUND, "Could not find artist");
    }

    res.status(SUCCESS_NO_CONTENT).end();
  }
);

export default artistRouter;
