import { Router } from "express";
import User from "../models/user.js";
//import Review from "../models/review.js";
import { requireAdmin } from "../middleware/auth.js";

const adminRouter = Router();

// Get all users
adminRouter.get("/users", requireAdmin, async (_req, res) => {
  const users = await User.find().exec();
  res.json(users);
});

// Get all user reviews
// adminRouter.get("/reviews", requireAdmin, async (_req, res) => {
//   const reviews = await Review.find().exec();
//   res.json(reviews);
// });
export default adminRouter;
