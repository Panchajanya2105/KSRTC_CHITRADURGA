import { Bus } from '../types/bus';

export function getMinutesUntilDeparture(timeStr: string, now: Date = new Date()): number {
  if (!timeStr) return 9999;
  const [hStr, mStr] = timeStr.split(':');
  const h = parseInt(hStr || '0', 10);
  const m = parseInt(mStr || '0', 10);

  const busTime = new Date(now);
  busTime.setHours(h, m, 0, 0);

  // If time has already passed today, calculate for tomorrow
  if (busTime.getTime() < now.getTime() - 60000) {
    busTime.setDate(busTime.getDate() + 1);
  }

  const diffMs = busTime.getTime() - now.getTime();
  return Math.floor(diffMs / 60000);
}


export function getUpcomingBuses(buses: Bus[], limit: number = 6, now: Date = new Date()): (Bus & { minsUntil: number })[] {
  return buses
    .map(bus => ({
      ...bus,
      minsUntil: getMinutesUntilDeparture(bus.time, now)
    }))
    .filter(item => item.minsUntil >= 0)
    .sort((a, b) => a.minsUntil - b.minsUntil)
    .slice(0, limit);
}
