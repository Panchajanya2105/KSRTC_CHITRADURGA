import { useState, useEffect } from 'react';
import { StationData, Bus } from '../types/bus';
import { STATIONS } from '../utils/constants';

// All station file keys to pre-fetch
const ALL_STATION_KEYS = STATIONS.map(s => s.key);

const CACHE_KEY = 'ksrtc_station_data_cache';
const CACHE_TIME_KEY = 'ksrtc_station_data_time';

async function fetchStationData(key: string): Promise<[string, StationData] | null> {
  try {
    const res = await fetch(`/data/${key}.json`);
    if (!res.ok) return null;
    const data: any = await res.json();

    const rawBuses = data.buses || [];
    const enrichedBuses: Bus[] = rawBuses.map((bus: any, idx: number) => {
      const timeVal = bus.time || bus.departureTime || '00:00';
      const serviceVal = bus.service || bus.serviceClass || 'Express';
      const fromVal = bus.from || key;
      return {
        ...bus,
        from: fromVal,
        destination: bus.destination || 'Destination',
        via: bus.via || '',
        time: timeVal,
        service: serviceVal,
        id: `${key}-${timeVal}-${bus.destination}-${idx}`
      };
    });

    return [key, {
      standName: data.station || data.standName || key,
      buses: enrichedBuses
    }];
  } catch {
    return null;
  }
}

export function useBusData(currentStandKey: string) {
  const [stationDataMap, setStationDataMap] = useState<Record<string, StationData>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Pre-fetch ALL stations in parallel on first mount
  useEffect(() => {
    let isMounted = true;

    async function loadAll() {
      // 1. Instantly load from cache if available
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          if (isMounted) {
            setStationDataMap(parsed);
            setLoading(false);
          }
        }
        if (cachedTime && isMounted) {
          setLastUpdated(new Date(cachedTime));
        }
      } catch (e) {
        console.warn('Failed to parse cache', e);
      }

      // 2. Fetch fresh data in the background
      const results = await Promise.all(ALL_STATION_KEYS.map(fetchStationData));
      if (!isMounted) return;

      const newMap: Record<string, StationData> = {};
      let hasData = false;
      results.forEach(result => {
        if (result) {
          const [key, data] = result;
          newMap[key] = data;
          hasData = true;
        }
      });

      // 3. Update state and cache if fetch was successful
      if (hasData) {
        setStationDataMap(newMap);
        const now = new Date();
        setLastUpdated(now);
        setLoading(false);
        setError(null);
        
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(newMap));
          localStorage.setItem(CACHE_TIME_KEY, now.toISOString());
        } catch (e) {
          console.warn('Failed to write to cache', e);
        }
      } else if (Object.keys(stationDataMap).length === 0) {
        // If fetch failed completely and we have no cache
        setError('Failed to load station schedules and no offline data available.');
        setLoading(false);
      }
    }

    loadAll().catch(err => {
      console.error('Error loading all stations:', err);
      if (isMounted && Object.keys(stationDataMap).length === 0) {
        setError('Failed to load station schedules');
        setLoading(false);
      }
    });

    return () => { isMounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentData = stationDataMap[currentStandKey] || null;

  return { currentData, loading, error, stationDataMap, lastUpdated };
}
