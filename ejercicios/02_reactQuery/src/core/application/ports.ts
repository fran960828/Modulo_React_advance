// foodRepository.ts

import type {
  EventSingle,
  EventGroup,
  EventPost,
  Image,
} from "../domain/models";

export interface GetEventRepository {
  getEvent: (id: string, signal: AbortSignal) => Promise<EventSingle>;
  getEvents: (
    signal: AbortSignal,
    max?: number,
    search?: string
  ) => Promise<EventGroup[]>;
}

export interface PostEventRepository {
  postEvent: (event: EventPost) => Promise<void>;
}

export interface PutEventRepository {
  putEvent: (data: { id: string; event: EventPost }) => Promise<void>;
}

export interface DeleteEventRepository {
  deleteEvent: (id: string) => Promise<void>;
}

export interface GetImagesRepository {
  getImages: (signal: AbortSignal) => Promise<Image[]>;
}
