import React from 'react';
import { Bus, Navigation, Phone } from 'lucide-react';
import { StationInfo } from '../types/bus';

interface ActiveStandBarProps {
  stationInfo: StationInfo;
  totalBuses: number;
  uniqueDestinations: number;
}

export const ActiveStandBar: React.FC<ActiveStandBarProps> = ({
  stationInfo,
  totalBuses,
  uniqueDestinations,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm mb-6 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        
        {/* Left info */}
        <div className="flex items-start md:items-center gap-4">
          <div className="text-4xl sm:text-5xl p-4 bg-rose-50 dark:bg-rose-950/60 rounded-2xl border border-rose-100 dark:border-rose-900/50 shadow-inner">
            {stationInfo.emoji}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {stationInfo.label}
              </h2>
              <span className="px-3 py-1 text-xs font-black text-emerald-500 dark:text-emerald-500 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Active Terminal
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
              {stationInfo.description}
            </p>
          </div>
        </div>

        {/* Right Stats Chips */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-300">
            <Bus className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>{totalBuses} Scheduled Buses</span>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-300">
            <Navigation className="w-4 h-4 text-sky-500 dark:text-sky-500" />
            <span>{uniqueDestinations} Routes</span>
          </div>

          <a 
            href={`tel:${stationInfo.phone.split('/')[0].trim()}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 dark:text-emerald-500 border border-emerald-300 dark:border-emerald-800 text-xs sm:text-sm font-extrabold hover:bg-emerald-100 transition-colors"
            title="Call Stand Enquiry Desk"
          >
            <Phone className="w-4 h-4 text-emerald-500" />
            <span>Enquiry Desk</span>
          </a>
        </div>

      </div>
    </div>
  );
};
