import {
  getEvent,
  getEvents,
  postEvent,
  putEvent,
  deleteEvent,
  getImages,
} from "../core/application/use-cases";
import { deleteEventImpl } from "../core/infrastructure/deleteImpl";
import {
  getImagesRepositoryImpl,
  getRepositoryImpl,
} from "../core/infrastructure/getImpl";
import { putEventImpl } from "../core/infrastructure/putImpl";
import { postEventImpl } from "../core/infrastructure/postImpl";

export const getEventDef = getEvent(getRepositoryImpl);

export const getEventsDef = getEvents(getRepositoryImpl);

export const postEventDef = postEvent(postEventImpl);

export const putEventDef = putEvent(putEventImpl);

export const deleteEventDef = deleteEvent(deleteEventImpl);

export const getImageDef = getImages(getImagesRepositoryImpl);
