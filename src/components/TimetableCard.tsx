import React from 'react';
import { ArrowRight, Clock, Bus as BusIcon } from 'lucide-react';
import { Bus, StationInfo } from '../types/bus';
import { isStarting } from '../utils/bus';
interface TimetableCardProps {
  bus: Bus;
  currentStation: StationInfo;
  onOpenModal: (bus: Bus) => void;
  formatBusTime?: (timeStr: string) => string;
  t: (key: string) => string;
}

export const TimetableCard: React.FC<TimetableCardProps> = ({
  bus,
  currentStation,
  onOpenModal,
  formatBusTime,
  t,
}) => {
  const starting = isStarting(bus, currentStation);

  const displayTime = formatBusTime ? formatBusTime(bus.time) : bus.time;

  const viaStops = bus.via
    ? bus.via.split(/[,/]/).map(s => s.trim()).filter(Boolean)
    : [];

  const originName = bus.from || currentStation.label.split(' ')[0];

  return (
    <div
      onClick={() => onOpenModal(bus)}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-rose-500/40 dark:hover:border-rose-500/40 transition-all duration-200 group flex flex-col gap-4 overflow-hidden cursor-pointer"
    >
      {/* Top Row: Departure Time | Badges */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 shrink-0">
          <Clock className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="underline decoration-rose-500 decoration-2 underline-offset-4 tracking-tight">
            {displayTime}
          </span>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
              starting
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                : 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400 border border-sky-300 dark:border-sky-800'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${starting ? 'bg-emerald-500' : 'bg-sky-500'}`} />
            {starting ? t('starting-badge') : t('passing-badge')}
          </span>
          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {bus.service || 'Express'}
          </span>
        </div>
      </div>

      {/* Route: Origin ➔ Destination */}
      <div className="flex items-center gap-2 text-base sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors flex-wrap">
        <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-100 dark:border-rose-900">
          <BusIcon className="w-5 h-5" />
        </div>
        <span className="text-slate-900 dark:text-white font-extrabold">{originName}</span>
        <ArrowRight className="w-5 h-5 text-rose-600 shrink-0" />
        <span className="text-rose-600 dark:text-rose-400 font-black">{bus.destination}</span>
      </div>

      {/* Via Stops — label inline with pills on the same row */}
      {viaStops.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 shrink-0">Via:</span>
          {viaStops.map((stop, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700"
            >
              {stop}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
