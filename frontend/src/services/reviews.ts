import type { Review } from "@/types";
import axios from "axios";

const BASE_URL = "/api/reviews";

const getUserReviews = async (): Promise<Review[]> => {
  const response = await axios.get(`${BASE_URL}/user`);
  return response.data;
};

const getAllReviews = async (): Promise<Review[]> => {
  const response = await axios.get(`${BASE_URL}`);
  return response.data;
};

const getReview = async (reviewId: string): Promise<Review> => {
  const response = await axios.get(`${BASE_URL}/${reviewId}`);
  return response.data;
};

const createReview = async (
  rating: number,
  comment: string,
  albumId: string
): Promise<Review> => {
  const response = await axios.post(`${BASE_URL}`, {
    rating,
    comment,
    albumId,
  });
  return response.data;
};

const updateReview = async (
  reviewId: string,
  rating: number,
  comment: string
): Promise<Review> => {
  const response = await axios.put(`${BASE_URL}/${reviewId}`, {
    rating,
    comment,
  });
  return response.data;
};

const deleteReview = async (id: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export default {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
};
