export interface Bus {
  id?: string;
  time: string; // e.g. "06:30"
  destination: string;
  from: string;
  via: string;
  service: string; // "Express" | "Ordinary" | "Rajahamsa" | "Airavat" | "Vaibhava" | "Sleeper" | "NAC Sleeper"
}

export interface StationData {
  standName: string;
  buses: Bus[];
}

export interface StationInfo {
  key: string;
  label: string;
  emoji: string;
  cities: string[];
  phone: string;
  description: string;
  gmapsUrl?: string;
  queryLocation?: string;
}

export type ViewType = 'home' | 'timetable' | 'stations' | 'favorites' | 'about';
export type TimetableTab = 'all' | 'starting' | 'passing';
export type TimeSlot = 'all' | 'morning' | 'afternoon' | 'evening' | 'night';
export type Language = 'en' | 'kn';

export interface CommentItem {
  id: string;
  text: string;
  timestamp: string;
  author: string;
}
