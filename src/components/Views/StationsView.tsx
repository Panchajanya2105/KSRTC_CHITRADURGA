import React from 'react';
import { MapPin, Phone, Bus, Check, ArrowRight, ExternalLink, Share2 } from 'lucide-react';
import { StationInfo, ViewType } from '../../types/bus';
import { STATIONS, StationDetail } from '../../utils/constants';
import { getCallablePhoneNumber } from '../../utils/phone';

interface StationsViewProps {
  currentStandKey: string;
  setCurrentStandKey: (key: string) => void;
  setCurrentView: (view: ViewType) => void;
  stationDataMap: Record<string, any>;
  t: (key: string) => string;
}

export const StationsView: React.FC<StationsViewProps> = ({
  currentStandKey,
  setCurrentStandKey,
  setCurrentView,
  stationDataMap,
  t,
}) => {

  const handleShareLocation = async (station: StationDetail) => {
    const text = `${station.label} Location & Enquiry Number:\nPhone: ${station.phone}\nMap: ${station.gmapsUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: station.label,
          text: text,
          url: station.gmapsUrl,
        });
      } catch (err) {
        console.log('Share error or cancelled:', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert(`Location details for ${station.label} copied to clipboard!`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* View Title */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <MapPin className="w-6 h-6 text-rose-600 dark:text-rose-400" />
          <span>{t('stations-title')}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
          Chitradurga Division operates 6 key bus terminals. Explore location maps, enquiry desk phone numbers, and departure routes.
        </p>
      </div>

      {/* Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STATIONS.map((station) => {
          const isSelected = currentStandKey === station.key;
          const busCount = stationDataMap[station.key]?.buses?.length || 0;

          return (
            <div
              key={station.key}
              className={`glass-card rounded-2xl p-6 relative flex flex-col justify-between transition-all border ${
                isSelected
                  ? 'ring-2 ring-rose-500 bg-rose-50/20 dark:bg-rose-950/20 shadow-lg border-rose-400'
                  : 'hover:shadow-md border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
                      {station.emoji}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {station.label}
                      </h3>
                      <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                        Chitradurga Division Hub
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                      <Check className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed font-medium">
                  {station.description}
                </p>

                {/* Key Metrics */}
                <div className="p-3.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <Bus className="w-5 h-5 text-rose-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">Daily departures</span>
                      <span className="text-xs font-extrabold text-slate-900 dark:text-slate-300">
                        {busCount > 0 ? `${busCount} Scheduled Buses` : 'Data unavailable'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Location Share & Google Maps Navigation Buttons */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <a
                    href={station.gmapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm w-full"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-sky-500" />
                    <span>Maps</span>
                  </a>

                  <button
                    onClick={() => handleShareLocation(station)}
                    className="btn btn-outline btn-sm w-full"
                  >
                    <Share2 className="w-3.5 h-3.5 text-amber-500" />
                    <span>Share</span>
                  </button>

                  <a
                    href={`tel:${getCallablePhoneNumber(station.phone)}`}
                    className="btn btn-outline btn-sm w-full"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Call</span>
                  </a>
                </div>

              </div>

              {/* Action */}
              <button
                onClick={() => {
                  setCurrentStandKey(station.key);
                  setCurrentView('timetable');
                }}
                className={`btn btn-sm w-full ${
                  isSelected
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                <span>{isSelected ? 'View Departure Schedule' : 'Switch to this Stand'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
};
