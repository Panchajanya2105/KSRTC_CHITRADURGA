import React from 'react';
import { BellRing, PhoneCall, ShieldAlert } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-rose-900 via-red-950 to-slate-900 text-white text-xs font-medium border-b border-rose-800/40 overflow-hidden py-2.5 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
        {/* Static badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-600 text-white rounded-lg text-[11px] font-black shrink-0 shadow-sm">
          <BellRing className="w-3.5 h-3.5 animate-pulse" />
          <span>Notice</span>
        </div>

        {/* Scrolling ticker */}
        <div className="overflow-hidden whitespace-nowrap relative w-full">
          <div className="inline-block animate-ticker hover:[animation-play-state:paused] cursor-default">
            <span className="inline-flex items-center gap-4 px-4 text-white font-semibold">
              <span>⚡ High frequency: Davanagere, Challakere &amp; Hiriyur buses every 15 mins</span>
              <span className="text-rose-400">|</span>
              <span className="inline-flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-rose-300" />
                Chitradurga Control: 7760036889
              </span>
              <span className="text-rose-400">|</span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-300" />
                Toll-Free Complaints: 080-26252625
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
