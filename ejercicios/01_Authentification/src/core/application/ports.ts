// foodRepository.ts

import type {
  AuthEvent,
  EventGet,
  EventPatch,
  EventPost,
  TokenEvent,
} from "../domain/models";

export interface GetEventRepository {
  getEvent: (id: string) => Promise<EventGet>;
  getEventsList: () => Promise<EventGet[]>;
}

export interface PostEventRepository {
  postEvent: (event: EventPost) => Promise<void>;
}

export interface PatchEventRepository {
  patchEvent: (id: string, event: EventPatch) => Promise<void>;
}

export interface DeleteEventRepository {
  deleteEvent: (id: string) => Promise<void>;
}

export interface AuthenticationRepository {
  authEvent: (auth: AuthEvent) => Promise<TokenEvent>;
}
