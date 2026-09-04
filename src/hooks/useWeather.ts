import { useState, useEffect } from 'react';

interface WeatherState {
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
}

export function useWeather(stationKey: string) {
  const [weather, setWeather] = useState<WeatherState>({
    temp: 28,
    condition: 'Partly Cloudy',
    icon: '🌤️',
    humidity: 62
  });

  useEffect(() => {
    // Generate realistic weather per station
    const baseTemp: Record<string, number> = {
      chitradurga: 29,
      challakere: 31,
      hiriyur: 30,
      holalkere: 27,
      bharamasagara: 28
    };

    const temp = baseTemp[stationKey] || 28;
    setWeather({
      temp,
      condition: temp > 30 ? 'Sunny & Warm' : 'Partly Cloudy',
      icon: temp > 30 ? '☀️' : '🌤️',
      humidity: 55 + Math.floor(Math.random() * 15)
    });
  }, [stationKey]);

  return weather;
}
