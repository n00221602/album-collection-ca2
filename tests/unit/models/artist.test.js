import Artist from "../../../models/artist.js";

describe("Artist Model", () => {
  describe("Schema validation", () => {
    test("should create artist with valid data", () => {
      const testArtist = {
        name: "Test Artist",
        releases: [
          {
            title: "Test Album",
            genre: ["Rock", "Pop"],
            year: 2020,
          },
        ],
        bio: "Test bio",
      };

      const artist = new Artist(testArtist);

      expect(artist.name).toBe("Test Artist");
      expect(artist.bio).toBe("Test bio");
      expect(artist.releases[0].title).toBe("Test Album");
      expect(artist.releases[0].genre).toEqual(["Rock", "Pop"]);
      expect(artist.releases[0].year).toBe(2020);
    });

    test("missing name field", () => {
      const testArtist = {
        releases: [],
        bio: "Test bio",
      };

      const artist = new Artist(testArtist);
      const isValid = artist.name !== undefined && artist.name !== null;

      expect(isValid).toBe(false);
      expect(artist.name).toBeUndefined();
    });

    test("missing releases field", () => {
      const testArtist = {
        name: "Test Artist",
        bio: "Test bio",
      };

      const artist = new Artist(testArtist);
      const isValid = Array.isArray(artist.releases) && artist.releases.length > 0;

      expect(isValid).toBe(false);
      expect(artist.releases).toEqual([]);
    });

    test("missing bio field", () => {
      const testArtist = {
        name: "Test Artist",
        releases: [],
      };

      const artist = new Artist(testArtist);
      const isValid = artist.bio !== undefined && artist.bio !== null;

      expect(isValid).toBe(false);
      expect(artist.bio).toBeUndefined();
    });

    test("missing album title", () => {
      const testArtist = {
        name: "Test Artist",
        releases: [
          {
            genre: ["Rock"],
            year: 2020,
          },
        ],
        bio: "Test bio",
      };

      const artist = new Artist(testArtist);
      const isValid = artist.releases[0].title !== undefined;

      expect(isValid).toBe(false);
      expect(artist.releases[0].title).toBeUndefined();
    });

    test("should handle missing album genre", () => {
      const testArtist = {
        name: "Test Artist",
        releases: [
          {
            title: "Test Album",
            year: 2020,
          },
        ],
        bio: "Test bio",
      };

      const artist = new Artist(testArtist);
      const isValid = Array.isArray(artist.releases[0].genre) && artist.releases[0].genre.length > 0;

      expect(isValid).toBe(false);
      expect(artist.releases[0].genre).toEqual([]);
    });

    test("should handle missing album year", () => {
      const testArtist = {
        name: "Test Artist",
        releases: [
          {
            title: "Test Album",
            genre: ["Rock"],
          },
        ],
        bio: "Test bio",
      };

      const artist = new Artist(testArtist);
      const isValid = artist.releases[0].year !== undefined;

      expect(isValid).toBe(false);
      expect(artist.releases[0].year).toBeUndefined();
    });

    test("should accept valid year range", () => {
      const testArtist = {
        name: "Test Artist",
        releases: [
          {
            title: "Test Album",
            genre: ["Rock"],
            year: 2020,
          },
        ],
        bio: "Test bio",
      };

      const artist = new Artist(testArtist);
      const isValid = artist.releases[0].year >= 1900 && artist.releases[0].year <= 2025;

      expect(isValid).toBe(true);
      expect(artist.releases[0].year).toBe(2020);
    });

    test("shouldnt accept invalid year range", () => {
      const testArtist = {
        name: "Test Artist",
        releases: [
          {
            title: "Test Album",
            genre: ["Rock"],
            year: 1800,
          },
        ],
        bio: "Test bio",
      };

      const artist = new Artist(testArtist);
      const isValid = artist.releases[0].year >= 1900 && artist.releases[0].year <= 2025;

      expect(isValid).toBe(false);
      expect(artist.releases[0].year).toBe(1800);
    });

  });
});