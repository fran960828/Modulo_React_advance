import {
  getEvent,
  getEvents,
  postEvent,
  patchEvent,
  deleteEvent,
} from "../core/application/use-cases";
import { deleteEventImpl } from "../core/infrastructure/deleteImpl";
import { getRepositoryImpl } from "../core/infrastructure/getImpl";
import { patchEventImpl } from "../core/infrastructure/patchImpl";
import { postEventImpl } from "../core/infrastructure/postImpl";

export const getEventDef = getEvent(getRepositoryImpl);

export const getEventsDef = getEvents(getRepositoryImpl);

export const postEventDef = postEvent(postEventImpl);

export const patchEventDef = patchEvent(patchEventImpl);

export const deleteEventDef = deleteEvent(deleteEventImpl);
