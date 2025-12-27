import type { Artist } from "@/types";
import axios from "axios";

const BASE_URL = "/api/artists";

const getAllArtists = async (): Promise<Artist[]> => {
  const response = await axios.get(`${BASE_URL}`);
  return response.data;
};

const getArtist = async (artistId: string): Promise<Artist> => {
  const response = await axios.get(`${BASE_URL}/${artistId}`);
  return response.data;
};

const createArtist = async (
  name: string,
  releases: { title: string; genres: string[]; year: string }[],
  bio: string
): Promise<Artist> => {
  const response = await axios.post(`${BASE_URL}`, { name, releases, bio });
  return response.data;
};

const updateArtist = async (
  artistId: string,
  name: string,
  bio: string
): Promise<Artist> => {
  const response = await axios.put(`${BASE_URL}/${artistId}`, {
    name,
    bio,
  });
  return response.data;
};

const deleteArtist = async (id: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export default {
  getAllArtists,
  getArtist,
  createArtist,
  updateArtist,
  deleteArtist,
};
