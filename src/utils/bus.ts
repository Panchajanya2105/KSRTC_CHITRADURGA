import { Bus, StationInfo } from '../types/bus';

export function getUniqueDestinations(buses: Bus[]): string[] {
  const set = new Set<string>();
  buses.forEach(b => {
    if (b.destination) set.add(b.destination);
  });
  return Array.from(set).sort();
}

export function isStarting(bus: Bus, currentStation: StationInfo): boolean {
  return currentStation.cities.some(city =>
    (bus.from || '').toLowerCase().includes(city)
  );
}
