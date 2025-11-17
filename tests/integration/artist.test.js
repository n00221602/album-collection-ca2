import createApp from "../../app.js";
import request from "supertest";
import User from "../../models/user.js";
import Artist from "../../models/artist.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

describe("Artist API", () => {
  let app;
  let adminAgent;
  let userAgent;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    app = createApp();

    // Create admin user for testing
    adminAgent = request.agent(app);
    await adminAgent.post("/auth/register").send({
      name: "Admin User",
      email: "admin@example.com",
      password: "AdminPass123",
    });

    // Manually set admin role (you might need to adjust this based on your implementation)
    await User.findOneAndUpdate(
      { email: "admin@example.com" },
      { role: "admin" }
    );

    await adminAgent.post("/auth/login").send({
      email: "admin@example.com",
      password: "AdminPass123",
    });

    // Create regular user for testing
    userAgent = request.agent(app);
    await userAgent.post("/auth/register").send({
      name: "Regular User",
      email: "user@example.com",
      password: "UserPass123",
    });

    await userAgent.post("/auth/login").send({
      email: "user@example.com",
      password: "UserPass123",
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }, 10000);

  afterEach(async () => {
    await Artist.deleteMany({});
  });

  describe("GET /artists", () => {
    test("should get all artists without authentication", async () => {
      // Create test artist
      await Artist.create({
        name: "Test Artist",
        bio: "Test bio",
        releases: [
          {
            title: "Test Album",
            genre: ["Rock", "Rap"],
            year: 2023,
          },
        ],
      });

      const response = await request(app).get("/artists");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty("name", "Test Artist");
      expect(response.body[0]).toHaveProperty("bio", "Test bio");
    });

    test("should return empty array when no artists exist", async () => {
      const response = await request(app).get("/artists");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(0);
    });
  });

  describe("GET /artists/:id", () => {
    test("should get specific artist by id", async () => {
      const artist = await Artist.create({
        name: "Specific Artist",
        bio: "Specific bio",
        releases: [
          {
            title: "Specific Album",
            genre: ["Pop", "Indie"],
            year: 2022,
          },
        ],
      });

      const response = await request(app).get(`/artists/${artist._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("name", "Specific Artist");
      expect(response.body).toHaveProperty("bio", "Specific bio");
      expect(response.body.releases).toHaveLength(1);
      expect(response.body.releases[0]).toHaveProperty("title", "Specific Album");
    });

    test("should return 404 for non-existent artist", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/artists/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
    });

    test("should return 400 for invalid artist id", async () => {
      const response = await request(app).get("/artists/invalid-id");

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /artists", () => {
    test("should create new artist with admin authentication", async () => {
      const response = await adminAgent.post("/artists").send({
        name: "New Artist",
        bio: "New artist bio",
        releases: [
          {
            title: "Debut Album",
            genre: ["Indie"],
            year: 2024,
          },
        ],
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("name", "New Artist");
      expect(response.body).toHaveProperty("bio", "New artist bio");
      expect(response.body.releases[0]).toHaveProperty("title", "Debut Album");
    });

    test("should reject artist creation without admin authentication", async () => {
      const response = await userAgent.post("/artists").send({
        name: "Unauthorized Artist",
        bio: "Should not be created",
        releases: [],
      });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error");
    });

    test("should reject artist creation without authentication", async () => {
      const response = await request(app).post("/artists").send({
        name: "No Auth Artist",
        bio: "Should not be created",
        releases: [],
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });

    test("should reject artist creation with missing fields", async () => {
      const response = await adminAgent.post("/artists").send({
        name: "Incomplete Artist",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    test("should reject artist creation with invalid genre format", async () => {
      const response = await adminAgent.post("/artists").send({
        name: "Bad Genre Artist",
        bio: "Test bio",
        releases: [
          {
            title: "Test Album",
            genre: "Rock",
            year: 2023,
          },
        ],
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("PUT /artists/:id", () => {
    test("should update artist with admin authentication", async () => {
      const artist = await Artist.create({
        name: "Original Artist",
        bio: "Original bio",
         releases: [
          {
            title: "New Album",
            genre: ["Electronic"],
            year: 2024,
          },
        ],
      });

      const response = await adminAgent.put(`/artists/${artist._id}`).send({
        name: "Updated Artist",
        bio: "Updated bio",
        releases: [
          {
            title: "Updated Album",
            genre: ["Electronic"],
            year: 2024,
          },
        ],
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("name", "Updated Artist");
      expect(response.body).toHaveProperty("bio", "Updated bio");
      expect(response.body.releases).toHaveLength(1);
    });

    test("should reject artist update without admin authentication", async () => {
      const artist = await Artist.create({
        name: "Test Artist",
        bio: "Test bio",
        releases: [],
      });

      const response = await userAgent.put(`/artists/${artist._id}`).send({
        name: "Should Not Update",
        bio: "Should not update",
        releases: [],
      });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error");
    });

    test("should return 404 for updating non-existent artist", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await adminAgent.put(`/artists/${fakeId}`).send({
        name: "Non Existent",
        bio: "Does not exist",
        releases: [],
      });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("DELETE /artists/:id", () => {
    test("should delete artist with admin authentication", async () => {
      const artist = await Artist.create({
        name: "To Be Deleted",
        bio: "Will be deleted",
        releases: [],
      });

      const response = await adminAgent.delete(`/artists/${artist._id}`);

      expect(response.status).toBe(204);

      const deletedArtist = await Artist.findById(artist._id);
      expect(deletedArtist).toBeNull();
    });

    test("should reject artist deletion without admin authentication", async () => {
      const artist = await Artist.create({
        name: "Protected Artist",
        bio: "Should not be deleted",
        releases: [],
      });

      const response = await userAgent.delete(`/artists/${artist._id}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error");

      const existingArtist = await Artist.findById(artist._id);
      expect(existingArtist).toBeTruthy();
    });

    test("should return 404 for deleting non-existent artist", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await adminAgent.delete(`/artists/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
    });
  });

});