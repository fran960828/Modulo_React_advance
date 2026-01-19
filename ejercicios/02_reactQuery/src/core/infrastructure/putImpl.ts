import type { PutEventRepository } from "../application/ports";
import { url } from "../domain/services";
import { httpClient } from "./api";

export const putEventImpl: PutEventRepository = {
  putEvent: async ({ id, event }) => {
    await httpClient.put(`${url}/${id}`, { event: event });
  },
};
