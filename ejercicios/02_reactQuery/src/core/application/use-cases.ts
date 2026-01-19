import type {
  GetEventRepository,
  PostEventRepository,
  PutEventRepository,
  DeleteEventRepository,
  GetImagesRepository,
} from "./ports";
import type { EventPost } from "../domain/models";

export const getEvents =
  (GetEventRepository: GetEventRepository) =>
  async (signal: AbortSignal, max?: number, search?: string) => {
    return GetEventRepository.getEvents(signal, max, search);
  };
export const getEvent =
  (GetEventRepository: GetEventRepository) =>
  async (id: string, signal: AbortSignal) => {
    return GetEventRepository.getEvent(id, signal);
  };
export const postEvent =
  (postEventRepository: PostEventRepository) => async (event: EventPost) => {
    return postEventRepository.postEvent(event);
  };
export const putEvent =
  (putEventRepository: PutEventRepository) =>
  async (data: { id: string; event: EventPost }) => {
    return putEventRepository.putEvent(data);
  };
export const deleteEvent =
  (deleteEventRepository: DeleteEventRepository) => async (id: string) => {
    return deleteEventRepository.deleteEvent(id);
  };
export const getImages =
  (GetImageRepository: GetImagesRepository) => async (signal: AbortSignal) => {
    return GetImageRepository.getImages(signal);
  };
