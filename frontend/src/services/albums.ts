import type { Album } from "@/types";
import axios from "axios";

const BASE_URL = "/api/albums";

const getAllAlbums = async (): Promise<Album[]> => {
  const response = await axios.get(`${BASE_URL}`);
  return response.data;
};

const getAlbum = async (albumId: string): Promise<Album> => {
  const response = await axios.get(`${BASE_URL}/${albumId}`);
  return response.data;
};

const createAlbum = async (
  title: string,
  genre: [string],
  year: number
): Promise<Album> => {
  const response = await axios.post(`${BASE_URL}`, { title, genre, year });
  return response.data;
};

const updateAlbum = async (
  albumId: string,
  title: string,
  genre: [string],
  year: number
): Promise<Album> => {
  const response = await axios.put(`${BASE_URL}/${albumId}`, {
    title,
    genre,
    year,
  });
  return response.data;
};

const deleteAlbum = async (id: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export default {
  getAllAlbums,
  getAlbum,
  createAlbum,
  updateAlbum,
  deleteAlbum,
};
