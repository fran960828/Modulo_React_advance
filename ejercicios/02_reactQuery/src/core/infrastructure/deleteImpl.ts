import type { DeleteEventRepository } from "../application/ports";
import { url } from "../domain/services";
import { httpClient } from "./api";

export const deleteEventImpl: DeleteEventRepository = {
  deleteEvent: async (id) => {
    await httpClient.delete(`${url}/${id}`);
  },
};
