import type { PatchEventRepository } from "../application/ports";
import { url } from "../domain/services";
import { httpClient } from "./api";

export const patchEventImpl: PatchEventRepository = {
  patchEvent: async (id, event) => {
    await httpClient.patch(`${url}${id}`, event);
  },
};
