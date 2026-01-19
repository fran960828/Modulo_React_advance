import type {
  GetEventRepository,
  GetImagesRepository,
} from "../application/ports";
import type {
  getEventSingleResponse,
  getEventGroupResponse,
  Image,
} from "../domain/models";
import { httpClient } from "./api";
import { url } from "../domain/services";

export const getRepositoryImpl: GetEventRepository = {
  getEvent: async (id, signal) => {
    const dto = await httpClient.get<getEventSingleResponse>(
      `${url}/${id}`,
      signal
    );
    return dto.event;
  },
  getEvents: async (signal, max, search) => {
    // Orden corregido para coincidir con el Port
    // Construimos la URL con query params
    const queryUrl = new URL(url);
    if (search) queryUrl.searchParams.append("search", search.toString());
    if (max) queryUrl.searchParams.append("max", max.toString());

    const dto = await httpClient.get<getEventGroupResponse>(
      queryUrl.toString(),
      signal
    );
    return dto.events; // Corregido a .events
  },
};

export const getImagesRepositoryImpl: GetImagesRepository = {
  getImages: async (signal: AbortSignal) => {
    const dto = await httpClient.get<Image[]>(`${url}/images/`, signal);
    return dto;
  },
};
