import { StationInfo } from '../types/bus';

export interface StationDetail extends StationInfo {
  gmapsUrl: string;
  queryLocation: string;
}

export const STATIONS: StationDetail[] = [
  {
    key: 'chitradurga',
    label: 'Chitradurga Bus Stand',
    emoji: '🏛️',
    cities: ['chitradurga', 'chitraduga'],
    phone: '7760036889',
    description: 'Central Division Bus Terminal serving major inter-city express routes to Bengaluru, Hubballi, Davangere, and Bellary.',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=KSRTC+Bus+Stand+Chitradurga+Karnataka',
    queryLocation: 'KSRTC Central Bus Stand, Chitradurga, Karnataka 577501'
  },
  {
    key: 'challakere',
    label: 'Challakere Bus Stand',
    emoji: '🌄',
    cities: ['challakere', 'challkere'],
    phone: '6364912207',
    description: 'Eastern hub connecting Chitradurga to Ballari, Anantapur, Rayadurg, and Pavagada.',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=KSRTC+Bus+Stand+Challakere+Karnataka',
    queryLocation: 'KSRTC Bus Stand, Challakere, Karnataka 577522'
  },
  {
    key: 'hiriyur',
    label: 'Hiriyuru Bus Stand',
    emoji: '🌾',
    cities: ['hiriyur', 'hiriyuru'],
    phone: '7760998022',
    description: 'Major National Highway 44 junction terminal connecting Bengaluru highway buses and local rural schedules.',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=KSRTC+Bus+Stand+Hiriyur+Karnataka',
    queryLocation: 'KSRTC Bus Stand, Hiriyur, NH44, Karnataka 577545'
  },
  {
    key: 'holalkere',
    label: 'Holalkere Bus Stand',
    emoji: '🏘️',
    cities: ['holalkere'],
    phone: '7760663383',
    description: 'Western regional stand connecting Shimoga, Hosadurga, Channagiri, and Davangere.',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=KSRTC+Bus+Stand+Holalkere+Karnataka',
    queryLocation: 'KSRTC Bus Stand, Holalkere, Karnataka 577526'
  },
  {
    key: 'bharamasagara',
    label: 'Bharamasagara Bus stand',
    emoji: '🛖',
    cities: ['bharamasagara'],
    phone: '6364912206',
    description: 'Crucial NH4 bypass stop and feeder hub for north Chitradurga rural services.',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=KSRTC+Bus+Stand+Bharamasagara+Karnataka',
    queryLocation: 'KSRTC Bus Stop, Bharamasagara, NH48, Karnataka 577519'
  },
  {
    key: 'hosadurga',
    label: 'Hosadurga Bus Stand',
    emoji: '🌲',
    cities: ['hosadurga'],
    phone: '7760998025',
    description: 'Southern regional stand connecting Chitradurga, Davangere, and Chikmagalur.',
    gmapsUrl: 'https://www.google.com/maps/search/?api=1&query=KSRTC+Bus+Stand+Hosadurga+Karnataka',
    queryLocation: 'KSRTC Bus Stand, Hosadurga, Karnataka 577527'
  }
];

export const ALL_STATION_CONTACTS = [
  { name: 'Chitradurga Bus Stand', phone: '7760036889', location: 'Chitradurga' },
  { name: 'Challakere Bus Stand ', phone: '6364912207', location: 'Challakere' },
  { name: 'Hiriyuru Bus Stand', phone: '7760998022', location: 'Hiriyur' },
  { name: 'Holalkere Bus Stand', phone: '7760663383', location: 'Holalkere' },
  { name: 'Bharamasagara Bus stand', phone: '6364912206', location: 'Bharamasagara' },
  { name: 'Hosadurga Bus Stand', phone: '7760998025', location: 'Hosadurga' },
  { name: 'KSRTC Toll-Free Customer Care', phone: '080-26252625', location: 'Toll-Free 24x7' },
  { name: 'Bengaluru Booking Counter', phone: '7760990034', location: 'KSRTC Central' }
];

export const DEST_ICONS: Record<string, string> = {
  'bangalore': '🏙️', 'bengaluru': '🏙️', 'banglore': '🏙️',
  'davangere': '🏛️', 'davanagere': '🏛️',
  'hubli': '🏢', 'hubballi': '🏢',
  'mysore': '🏰', 'mysuru': '🏰',
  'mangalore': '🌊', 'mangaluru': '🌊',
  'shivamogga': '🌳', 'shimoga': '🌳',
  'hosapete': '🏗️', 'hospet': '🏗️',
  'ballari': '⛏️', 'bellary': '⛏️',
  'tumakuru': '🌾', 'tumkur': '🌾',
  'chitradurga': '🏰',
  'challakere': '🌄',
  'hiriyur': '🌾', 'hiriyuru': '🌾',
  'holalkere': '🏘️',
  'hassan': '🛕',
  'hyderabad': '🌆',
  'tirupati': '🛕', 'tirupathi': '🛕',
  'chennai': '🌊',
  'belagavi': '🏔️',
  'chikkaballapura': '🌄',
  'kgf': '💎',
};
