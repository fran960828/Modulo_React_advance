import type { EventPatch,EventPost } from "../domain/models";
import type { GetEventRepository, PostEventRepository, PatchEventRepository,DeleteEventRepository } from "./ports";

export const getEvents = (GetEventRepository: GetEventRepository) => async () => {
  return GetEventRepository.getEventsList();
};
export const getEvent = (GetEventRepository: GetEventRepository) => async (id:string) => {
  return GetEventRepository.getEvent(id);
};
export const postEvent = (postEventRepository: PostEventRepository) => async (event:EventPost) => {
  return postEventRepository.postEvent(event);
};
export const patchEvent = (patchEventRepository: PatchEventRepository) => async (id:string,event:EventPatch) => {
  return patchEventRepository.patchEvent(id,event);
};
export const deleteEvent = (deleteEventRepository: DeleteEventRepository) => async (id:string) => {
  return deleteEventRepository.deleteEvent(id);
};



