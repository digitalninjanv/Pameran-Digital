
export interface Artwork {
  id: number;
  title: string;
  artist: string;
  year: number;
  imageSrc: string;
  description: string;
  medium: string;
  dimensions: string;
  position: {
    pitch: number;
    yaw: number;
  };
}

export interface GuestbookEntry {
  id: number;
  name: string;
  comment: string;
  timestamp: string;
}