import { catchError, getToken } from "../utils/helper";
import client from "./client";

export const uploadTrailer = async (formData, onUploadProgress) => {
  const token = getToken();
  try {
    const { data } = await client.post("/movie/upload-trailer", formData, {
      headers: {
        authorization: "Bearer " + token,
        "content-type": "multipart/form-data",
      },
      //pass another method
      //is this how much we upload to the backend server, not to cloundary
      //or whomever hosts the videos
      onUploadProgress: ({ loaded, total }) => {
        if (onUploadProgress)
          onUploadProgress(Math.floor((loaded / total) * 100));
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const uploadMovie = async (formData) => {
  const token = getToken();
  try {
    const { data } = await client.post("/movie/create", formData, {
      headers: {
        authorization: "Bearer " + token,
        "content-type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getMovieForUpdate = async (id) => {
  const token = getToken();
  try {
    //don't need to include get for client.get, can just use client
    const { data } = await client("/movie/for-update/" + id, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//have file as well if we want to update the poster of the movie: so need formData
export const updateMovie = async (id, formData) => {
  const token = getToken();
  try {
    //don't need to include get for client.get, can just use client
    const { data } = await client.patch("/movie/update/" + id, formData, {
      headers: {
        authorization: "Bearer " + token,
        "content-type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getMovies = async (pageNo, limit) => {
  const token = getToken();
  try {
    const { data } = await client(
      `/movie/movies?pageNo=${pageNo}&limit=${limit}`,
      {
        headers: {
          authorization: "Bearer " + token,
          "content-type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const deleteMovie = async (id) => {
  const token = getToken();
  try {
    const { data } = await client.delete("/movie/" + id, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const searchMovieForAdmin = async (title) => {
  const token = getToken();
  try {
    //remember that don't need .get for getting function, just client(...) works
    const { data } = await client(`/movie/search?title=${title}`, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//in the backend, we get the topRatedMovies by type which is optional
export const getTopRatedMovies = async (type) => {
  try {
    let endpoint = "/movie/top-rated";
    if (type) endpoint = endpoint + "?type=" + type;
    //remember that don't need .get for getting function, just client(...) works
    const { data } = await client(endpoint);
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getLatestUploads = async () => {
  try {
    const { data } = await client("movie/latest-uploads");
    return data;
  } catch (error) {
    return catchError(error);
  }
};
