import mongoose from "mongoose";
import User from "../models/user.js";
import Artist from "../models/artist.js";
import Review from "../models/review.js";

//Token: VdealDdEcIKuzMoTGClVUUykVMMuDKFLDehQNoVW

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Artist.deleteMany({});
    await Review.deleteMany({});
    console.log("Cleared existing data");

    // Create users
    const passwordHash1 = await User.hashPassword("password123");
    const user1 = await User.create({
      name: "Joe Doe",
      email: "joe@example.com",
      passwordHash: passwordHash1,
      role: "admin",
    });

    const passwordHash2 = await User.hashPassword("password456");
    const user2 = await User.create({
      name: "Megan Wall",
      email: "megan@example.com",
      passwordHash: passwordHash2,
      role: "user",
    });

    console.log("Created users");

    //Create example artists
    const artist1 = await Artist.create({
      name: "Tyler, The Creator",
      releases: [
        {
          title: "IGOR",
          genre: ["Hip-Hop", "Rap"],
          year: 2019,
        },
        {
          title: "CALL ME IF YOU GET LOST",
          genre: ["Hip-Hop", "Rap"],
          year: 2021,
        },
      ],
      bio: "American rapper, singer, songwriter, record producer, and music video director.",
    });

    const artist2 = await Artist.create({
      name: "N.E.R.D",
      releases: [
        {
          title: "In search of...",
          genre: ["Rock", "Hip-Hop"],
          year: 2001,
        },
        {
          title: "Fly or Die",
          genre: ["Rock", "Hip-Hop"],
          year: 2004,
        },
      ],
      bio: "American hip hop and rock band formed by Pharrell Williams, Chad Hugo, and Shay Haley.",
    });

    const artist3 = await Artist.create({
      name: "Gorillaz",
      releases: [
        {
          title: "Demon Days",
          genre: ["Alternative", "Indie"],
          year: 2005,
        },
        {
          title: "Plastic Beach",
          genre: ["Alternative", "Electronic"],
          year: 2010,
        },
      ],
      bio: "British virtual band created by Damon Albarn and Jamie Hewlett.",
    });

    const artist4 = await Artist.create({
      name: "The Prodigy",
      releases: [
        {
          title: "The Fat of the Land",
          genre: ["Electronic", "Dance"],
          year: 1997,
        },
        {
          title: "Experience",
          genre: ["Electronic", "Dance"],
          year: 1992,
        },
      ],
      bio: "English electronic dance music band formed in 1990.",
    });

    const review1 = await Review.create({
      rating: 9,
      comment: "woahhhh",
      userId: user1._id,
      albumId: artist1.releases[0]._id,
    });

    const review2 = await Review.create({
      rating: 6,
      comment: "wowwwww",
      userId: user2._id,
      albumId: artist2.releases[1]._id,
    });

    const review3 = await Review.create({
      rating: 4,
      comment: "booooo",
      userId: user1._id,
      albumId: artist3.releases[0]._id,
    });

    console.log("Created albums");
    console.log("\nSeed data added successfully!");
    console.log(`User 1 ID: ${user1._id}`);
    console.log(`User 2 ID: ${user2._id}`);
    console.log(`Artist 1 ID: ${artist1._id}`);
    console.log(`Artist 2 ID: ${artist2._id}`);
    console.log(`Artist 3 ID: ${artist3._id}`);
    console.log(`Artist 4 ID: ${artist4._id}`);
    console.log(`Review 1 ID: ${review1._id}`);
    console.log(`Review 2 ID: ${review2._id}`);
    console.log(`Review 3 ID: ${review3._id}`);

    //Close database connection
    await mongoose.connection.close();
    console.log("\nDatabase connection closed");
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
