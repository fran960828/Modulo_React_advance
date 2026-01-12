import type { HTMLFormMethod } from "react-router-dom";

// HTTP REQUEST
export interface EventGet {
  id: string;
  title: string;
  date: string;
  image: string;
  description: string;
}

export interface EventPost {
  title: string;
  date: string;
  image: string;
  description: string;
}

export type EventPatch = Partial<EventPost>;

export type getEventsResponse = { events: EventGet[] };

export type getEventResponse = { event: EventGet };

// PROPS

export interface IEventForm {
  method:HTMLFormMethod,
  event?:EventPost
}
