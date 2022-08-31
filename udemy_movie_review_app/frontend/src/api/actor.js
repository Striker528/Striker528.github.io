import { catchError, getToken } from "../utils/helper";
import client from "./client";

export const createActor = async (formData) => {
  //endpoint to send the data
  //backend => /api/actor/create
    const token = getToken();
  try {
    const { data } = await client.post("/actor/create", formData, {
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


export const searchActor = async (query) => {
  //endpoint to send the data
  //backend => /api/actor/create
    const token = getToken();
  try {
    //don't need client.get("/actor/search", ...) can just do:
      //don't send the formData, send the query: "/actor/search?query"
      //query is the name
    const { data } = await client(`/actor/search?name=${query}`, {
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