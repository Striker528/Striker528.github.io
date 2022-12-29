import { catchError, getToken } from "../utils/helper";
import client from "./client";

export const addReview = async (movieId, reviewData) => {
  const token = getToken();
  try {
    const { data } = await client.post(`/review/add/${movieId}`, reviewData, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getReviewByMovie = async (movieId) => {
  try {
    const { data } = await client(`review/get-reviews-by-movie/${movieId}`);
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const deleteReview = async (reviewId) => {
  const token = getToken();
  try {
    const { data } = await client.delete(`/review/${reviewId}`, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//For the headers, I added in the content-type multiple thing and that messed me up for a solid hour,
//Keep in mind what headers to send exactly!!!!
//I added in ("content-type": "multipart/form-data",) as I was copying not knowing what it really means and so it formatted
//the data in a weird way so that the rating and content did not get sent over, since this is just a simple object, I do not need
//to specify the content-type with how the form is set up
export const updateReview = async (reviewId, reviewData) => {
  const token = getToken();
  try {
    const { data } = await client.patch(`/review/${reviewId}`, reviewData, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};
