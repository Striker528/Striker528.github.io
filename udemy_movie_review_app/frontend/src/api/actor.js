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
