import { Router } from "express";
import Artist from "../models/artist.js";
import { albumSchema, albumIdSchema } from "../utils/validators.js";
import { HttpError, NOT_FOUND } from "../utils/HttpError.js";
import { validate } from "../middleware/validateRequest.js";
import { requireAdmin } from "../middleware/auth.js";
import Review from "../models/review.js";

//const SUCCESS_NO_CONTENT = 204;

const albumRouter = Router();

//Get all albums by extracting them from each artist
albumRouter.get("/", async (req, res) => {
  const artists = await Artist.find().exec();

  //Define empty array to hold all albums
  const allAlbums = [];

  //Loop through each artist and their releases and push to allAlbums
  artists.forEach((artist) => {
    artist.releases.forEach((album) => {
      allAlbums.push({
        id: album._id,
        title: album.title,
        genre: album.genre,
        year: album.year,
        artist: {
          id: artist.id,
          name: artist.name,
        },
      });
    });
  });

  res.json(allAlbums);
});

//Get an album by ID
albumRouter.get("/:id", async (req, res) => {
  const artists = await Artist.find().exec();

  let targetAlbum = null;
  let targetArtist = null;

  //Loop through each artist to find the album. If id matches the loop breaks
  for (const artist of artists) {
    const album = artist.releases.id(req.params.id);
    if (album) {
      targetAlbum = album;
      targetArtist = artist;
      break;
    }
  }

  //Find all reviews for the album by cross-referencing its id
  const review = await Review.find({ albumId: req.params.id }).exec();
  const reviewInfo = {
    rating: review.rating,
    comment: review.comment,
    userId: review.userId
  }

  if (!targetAlbum) {
    throw new HttpError(NOT_FOUND, "Could not find album");
  }

  //Return the targetted album
  res.json({
    id: targetAlbum._id,
    title: targetAlbum.title,
    genre: targetAlbum.genre,
    year: targetAlbum.year,
    artist: {
      id: targetArtist.id,
      name: targetArtist.name,
    },
    reviewInfo
  });
});

//Create new album for an artist
albumRouter.post("/", requireAdmin, validate(albumSchema), async (req, res) => {
  const { title, genre, year, artistId } = req.body;

  const artist = await Artist.findById(artistId);

  if (!artist) {
    throw new HttpError(NOT_FOUND, "Could not find artist");
  }

  //Add the new album to artist releases
  const newAlbum = { title, genre, year };
  artist.releases.push(newAlbum);
  await artist.save();

  //Since the new album is pushed to the end of the array, we can get it's index using length -1
  const createdAlbum = artist.releases[artist.releases.length - 1];

  res.status(201).json({
    id: createdAlbum._id,
    title: createdAlbum.title,
    genre: createdAlbum.genre,
    year: createdAlbum.year,
    artist: {
      id: artist.id,
      name: artist.name,
    },
  });
});

//Update an existing album
albumRouter.put(
  "/:id",
  requireAdmin,
  validate(albumIdSchema),
  validate(albumSchema),
  async (req, res) => {
    const { title, genre, year } = req.body;
    const artists = await Artist.find().exec();

    let updatedAlbum = null;
    let parentArtist = null;

    //Find the target album id by looping through each artist
    for (const artist of artists) {
      const album = artist.releases.id(req.params.id);
      if (album) {
        //Update the album fields
        album.title = title;
        album.genre = genre;
        album.year = year;

        //Saves any changes made
        await artist.save();

        updatedAlbum = album;
        parentArtist = artist;
        break;
      }
    }

    if (!updatedAlbum) {
      throw new HttpError(NOT_FOUND, "Could not find album");
    }

    res.json({
      id: updatedAlbum._id,
      title: updatedAlbum.title,
      genre: updatedAlbum.genre,
      year: updatedAlbum.year,
      artist: {
        id: parentArtist.id,
        name: parentArtist.name,
      },
    });
  }
);

//Delete album
albumRouter.delete(
  "/:id",
  requireAdmin,
  validate(albumIdSchema),
  async (req, res) => {
    const artists = await Artist.find().exec();
    //deleted flag
    let deleted = false;

    //Find target album by looping through each artist
    for (const artist of artists) {
      const album = artist.releases.id(req.params.id);
      if (album) {
        artist.releases.pull(req.params.id);
        await artist.save();
        deleted = true;
        break;
      }
    }

    if (!deleted) {
      throw new HttpError(NOT_FOUND, "Could not find album");
    }

    res.status(200).json({ message: "Album deleted successfully" });
  }
);

export default albumRouter;
