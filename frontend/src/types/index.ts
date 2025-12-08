export interface Album {
  id: string;
  title: string;
  genre: [string];
  year: number;
  favorite: boolean;
  artist: {
    id: string;
    name: string;
  };
}

export interface Artist {
  id: string;
  name: string;
  releases: {
    id: string;
    title: string;
    genre: [string];
    year: number;
  }[];
  bio: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
}

type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  role: UserRole;
}
