import type { GetEventRepository } from "../application/ports";
import type { getEventResponse, getEventsResponse } from "../domain/models";
import { httpClient } from "./api";
import { url } from "../domain/services";

export const getRepositoryImpl: GetEventRepository = {
  getEvent: async (id) => {
    const dto = await httpClient.get<getEventResponse>(`${url}${id}`);
    return dto.event;
  },
  getEventsList: async () => {
    const dto = await httpClient.get<getEventsResponse>(url);
    return dto.events;
  },
};
