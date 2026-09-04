import React, { useState, useEffect, useMemo } from 'react';
import { Bus, ArrowRight, Navigation, MapPin, Zap, Clock, AlertCircle } from 'lucide-react';
import { Bus as BusType, StationInfo, ViewType } from '../../types/bus';
import { ActiveStandBar } from '../ActiveStandBar';
import { DEST_ICONS } from '../../utils/constants';
import { getMinutesUntilDeparture, getUpcomingBuses } from '../../utils/time';
import { getUniqueDestinations } from '../../utils/bus';

interface HomeViewProps {
  currentStation: StationInfo;
  buses: BusType[];
  onOpenModal: (bus: BusType) => void;
  setCurrentView: (view: ViewType) => void;
  setTimetableQuery: (q: string) => void;
  t: (key: string) => string;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentStation,
  buses,
  onOpenModal,
  setCurrentView,
  setTimetableQuery,
  t,
}) => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 5000);
    return () => clearInterval(timer);
  }, []);

  const upcomingBusesWithCountdown = useMemo(() => {
    return getUpcomingBuses(buses, 12, now);
  }, [buses, now]);

  const next15MinBuses = useMemo(() => {
    return upcomingBusesWithCountdown.filter(b => b.minsUntil >= 0 && b.minsUntil <= 15);
  }, [upcomingBusesWithCountdown]);

  const uniqueDestinations = useMemo(() => getUniqueDestinations(buses), [buses]);

  const topDestinations = useMemo(() => {
    const freqMap: Record<string, number> = {};
    buses.forEach(b => {
      freqMap[b.destination] = (freqMap[b.destination] || 0) + 1;
    });
    return Object.keys(freqMap)
      .sort((a, b) => freqMap[b] - freqMap[a])
      .slice(0, 8);
  }, [buses]);

  const getDestIcon = (dest: string) => {
    const d = (dest || '').toLowerCase();
    for (const [k, v] of Object.entries(DEST_ICONS)) {
      if (d.includes(k)) return v;
    }
    return '🚌';
  };

  const currentTimeDisplay = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="space-y-6">

      {/* Active Stand Meta Bar */}
      <ActiveStandBar
        stationInfo={currentStation}
        totalBuses={buses.length}
        uniqueDestinations={uniqueDestinations.length}
      />

      {/* ── Hero Banner ── */}
      <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-br from-rose-900 via-red-950 to-slate-900 text-white shadow-2xl overflow-hidden border border-rose-800/40">

        {/* Decorative blobs */}
        <div className="absolute -right-16 -bottom-16 w-96 h-96 rounded-full bg-rose-600/20 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -top-10 w-72 h-72 rounded-full bg-amber-500/15 blur-2xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-64 h-64 rounded-full bg-sky-600/10 blur-3xl pointer-events-none" />

        {/* Floating emoji decorations */}
        <div className="absolute top-6 right-8 text-5xl sm:text-7xl opacity-10 select-none pointer-events-none rotate-6">🚌</div>
        <div className="absolute bottom-6 left-8 text-4xl opacity-10 select-none pointer-events-none -rotate-12">🛣️</div>

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">

          {/* Live badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold tracking-widest">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            KSRTC Live Timetable — {currentStation.label}
          </span>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Plan Your Journey from{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">
              {currentStation.label}
            </span>
          </h2>

          {/* Subtext */}
          <p className="text-sm sm:text-lg text-white/80 font-medium max-w-xl mx-auto leading-relaxed">
            View real-time departure boards and comprehensive timetables for your journey.
          </p>

          {/* ── CTA Buttons ── */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              id="btn-explore-timetable"
              onClick={() => setCurrentView('timetable')}
              className="btn btn-primary btn-lg group"
            >
              <Bus className="w-5 h-5" />
              <span>Explore Timetable</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="btn-view-bus-stands"
              onClick={() => setCurrentView('stations')}
              className="btn btn-lg group bg-transparent hover:bg-white/10 border border-white/30 text-white backdrop-blur-sm transition-all"
            >
              <MapPin className="w-5 h-5 text-sky-500" />
              <span>View Bus Stands</span>
            </button>
          </div>

          {/* Quick feature stats */}
          <div className="flex items-center justify-center gap-6 pt-2 text-xs font-bold text-rose-400/70 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Live departure board
            </span>
            <span className="w-1 h-1 rounded-full bg-rose-600/60" />
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-rose-400" /> Updated every 5s
            </span>
            <span className="w-1 h-1 rounded-full bg-rose-600/60" />
            <span className="flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-sky-500" /> 6 Division Terminals
            </span>
          </div>

          {/* Popular destinations strip */}
          <div className="pt-2 text-center">
            <span className="text-xs font-extrabold text-rose-400/60 tracking-wider mb-3 block">
              Popular Destinations
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {topDestinations.map((dest) => (
                <button
                  key={dest}
                  onClick={() => {
                    setTimetableQuery(dest);
                    setCurrentView('timetable');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/40 text-white text-xs sm:text-sm font-bold border border-white/15 transition-all flex items-center gap-1.5 hover:scale-105"
                >
                  <MapPin className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>{dest}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Live Departure Board ── */}
      <div className="bg-slate-900 dark:bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 text-white shadow-xl space-y-5">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Zap className="w-3.5 h-3.5 fill-white animate-bounce" />
                Live Departure Board
              </span>
              <span className="text-xs font-bold text-rose-400">
                Data loaded for {currentStation.label}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5">
              ⚡ Buses Departing in Next 15 Minutes at {currentStation.label}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Based on your browser local time ({currentTimeDisplay}) and actual station schedules.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 text-rose-400 border border-slate-700 text-xs font-extrabold shrink-0">
            <Clock className="w-4 h-4 text-rose-400" />
            <span>Clock: {currentTimeDisplay}</span>
          </div>
        </div>

        {next15MinBuses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {next15MinBuses.map((bus) => {
              const mins = getMinutesUntilDeparture(bus.time, now);
              return (
                <div
                  key={bus.id || `${bus.time}-${bus.destination}`}
                  onClick={() => onOpenModal(bus)}
                  className="bg-slate-800/90 hover:bg-slate-800 border-2 border-emerald-500/60 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer space-y-2.5 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 text-xs font-black">
                        {mins === 0 ? 'BOARDING NOW' : `Departs in ${mins} mins`}
                      </span>
                    </div>
                    <span className="text-lg font-black text-white">
                      {bus.time}
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                    <h4 className="text-base font-black text-white group-hover:text-rose-400 transition-colors">
                      {bus.from || currentStation.label.split(' ')[0]} ➔ {bus.destination}
                    </h4>
                  </div>

                  <div className="text-xs font-medium text-slate-300 truncate pt-4 mt-2 pb-1 border-t border-slate-700/80">
                    {bus.service || 'Express'} • Via: {bus.via || 'Direct'}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Fallback: closest upcoming departures */
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-center gap-2.5 text-xs text-slate-300 font-bold">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>No bus scheduled in the next 15 minutes at {currentStation.label}. Here are the closest upcoming departures:</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {upcomingBusesWithCountdown.slice(0, 8).map((bus) => (
                <div
                  key={bus.id || `${bus.time}-${bus.destination}`}
                  onClick={() => onOpenModal(bus)}
                  className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-md transition-all cursor-pointer space-y-2.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-extrabold">
                      Departs in {bus.minsUntil} mins
                    </span>
                    <span className="text-lg font-black text-rose-300">
                      {bus.time}
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                    <h4 className="text-base font-extrabold text-white group-hover:text-rose-400 transition-colors">
                      {bus.from || currentStation.label.split(' ')[0]} ➔ {bus.destination}
                    </h4>
                  </div>

                  <div className="text-xs font-medium text-slate-300 truncate pt-4 mt-2 pb-1 border-t border-slate-700/60">
                    {bus.service || 'Express'} • Via: {bus.via || 'Direct'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── Overview Quick-Access Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">

        <div
          onClick={() => setCurrentView('timetable')}
          className="flex flex-col h-full glass-card rounded-2xl p-6 cursor-pointer group space-y-3 border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 dark:text-sky-500 flex items-center justify-center font-bold group-hover:bg-sky-600 group-hover:text-white transition-colors shrink-0">
            <Bus className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-500 dark:group-hover:text-sky-500 transition-colors">
            Full Departure Schedule
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-2">
            Browse all {buses.length} buses departing from {currentStation.label} filtered by time slot and origin.
          </p>
          <span className="mt-auto inline-flex items-center gap-1 text-xs font-extrabold text-sky-500 dark:text-sky-500">
            <span>View Timetable</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

        <div
          onClick={() => setCurrentView('stations')}
          className="flex flex-col h-full glass-card rounded-2xl p-6 cursor-pointer group space-y-3 border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 dark:text-sky-500 flex items-center justify-center font-bold group-hover:bg-sky-600 group-hover:text-white transition-colors shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-500 dark:group-hover:text-sky-500 transition-colors">
            6 Division Terminals
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-2">
            Explore bus stands for Chitradurga, Challakere, Hiriyur, Holalkere, Bharamasagara, and Hosadurga with Google Maps links.
          </p>
          <span className="mt-auto inline-flex items-center gap-1 text-xs font-extrabold text-sky-500 dark:text-sky-500">
            <span>View Stations</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

        <div
          onClick={() => setCurrentView('about')}
          className="flex flex-col h-full glass-card rounded-2xl p-6 cursor-pointer group space-y-3 border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 dark:text-sky-500 flex items-center justify-center font-bold group-hover:bg-sky-600 group-hover:text-white transition-colors shrink-0">
            <Navigation className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-500 dark:group-hover:text-sky-500 transition-colors">
            Info & Contact
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-2">
            Learn about the portal, KSRTC division contacts, and frequently asked questions.
          </p>
          <span className="mt-auto inline-flex items-center gap-1 text-xs font-extrabold text-sky-500 dark:text-sky-500">
            <span>View Info</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

      </div>

    </div>
  );
};
