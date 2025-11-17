import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import adminRouter from "./controllers/admin.js";
import albumRouter from "./controllers/albums.js";
import authRouter from "./controllers/auth.js";
import artistRouter from "./controllers/artists.js";
import reviewRouter from "./controllers/reviews.js";
import { errorHandler } from "./middleware/error.js";

const createApp = () => {
  const app = express();
  app.use(express.json());

  //Configure express-session with connect-mongo
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "dev-secret-change-in-production",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        client: mongoose.connection.getClient(),
        touchAfter: 24 * 3600, // lazy session update
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, //Sets the cookie lifespan to 1 week
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
    })
  );

  //Connect the controller routes
  app.use("/admin", adminRouter);
  app.use("/albums", albumRouter);
  app.use("/auth", authRouter);
  app.use("/artists", artistRouter);
  app.use("/reviews", reviewRouter);

  app.use(errorHandler);

  const unknownEndpoint = (_req, res) => {
    res.status(404).send({ error: "Unknown endpoint" });
  };

  app.use(unknownEndpoint);

  const handleError = (error, _req, res, next) => {
    console.error(error.message);

    res.status(500).json({ error: "Internal Server Error" });

    next(error);
  };

  app.use(handleError);

  return app;
};

export default createApp;
