import { type PostEventRepository } from "../application/ports";
import { url } from "../domain/services";
import { httpClient } from "./api";

export const postEventImpl: PostEventRepository = {
  postEvent: async (event) => {
    await httpClient.post(url, { event: event });
  },
};
