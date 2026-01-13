import type { AuthEvent, EventPatch, EventPost } from "../domain/models";
import type {
  GetEventRepository,
  PostEventRepository,
  PatchEventRepository,
  DeleteEventRepository,
  AuthenticationRepository,
} from "./ports";

export const getEvents =
  (GetEventRepository: GetEventRepository) => async () => {
    return GetEventRepository.getEventsList();
  };
export const getEvent =
  (GetEventRepository: GetEventRepository) => async (id: string) => {
    return GetEventRepository.getEvent(id);
  };
export const postEvent =
  (postEventRepository: PostEventRepository) => async (event: EventPost) => {
    return postEventRepository.postEvent(event);
  };
export const patchEvent =
  (patchEventRepository: PatchEventRepository) =>
  async (id: string, event: EventPatch) => {
    return patchEventRepository.patchEvent(id, event);
  };
export const deleteEvent =
  (deleteEventRepository: DeleteEventRepository) => async (id: string) => {
    return deleteEventRepository.deleteEvent(id);
  };
export const authEvent =
  (authentificationRepository: AuthenticationRepository) =>
  async (event: AuthEvent) => {
    return authentificationRepository.authEvent(event);
  };
