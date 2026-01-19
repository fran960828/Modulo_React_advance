export interface EventGroup {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
}

export interface Image {
  path: string;
  caption: string;
}

export interface EventSingle {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
}

export interface EventPost {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image?: string;
}

export type getEventSingleResponse = { event: EventSingle };
export type getEventGroupResponse = { events: EventGroup[] };

export interface ImagePickerProp {
  images: Image[];
  selectedImage: string | undefined;
  onSelect: (image: string) => void;
}
