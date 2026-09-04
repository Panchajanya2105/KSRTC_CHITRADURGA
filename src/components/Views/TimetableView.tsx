import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Calendar, Download, Share2, Filter, Bus as BusIcon, Grid, List, X, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Bus, StationInfo, TimetableTab, TimeSlot } from '../../types/bus';
import { TimetableCard } from '../TimetableCard';
import { downloadSearchResultsAsPDF, shareSearchResults } from '../../utils/pdfExport';
import { getUniqueDestinations, isStarting } from '../../utils/bus';
const PAGE_SIZE = 50;

interface TimetableViewProps {
  currentStation: StationInfo;
  buses: Bus[];
  onOpenModal: (bus: Bus) => void;
  initialQuery?: string;
  onQueryConsumed?: () => void;
  t: (key: string) => string;
}

export const TimetableView: React.FC<TimetableViewProps> = ({
  currentStation,
  buses,
  onOpenModal,
  initialQuery = '',
  onQueryConsumed,
  t,
}) => {
  const [activeTab, setActiveTab] = useState<TimetableTab>('all');
  const [activeSlot, setActiveSlot] = useState<TimeSlot>('all');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [inputValue, setInputValue] = useState<string>('');
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [viewLayout, setViewLayout] = useState<'grid' | 'table'>('table');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [page, setPage] = useState(1);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  // Consume initialQuery (e.g. from Home popular destination click)
  useEffect(() => {
    if (initialQuery) {
      setInputValue(initialQuery);
      setFilterQuery(initialQuery);
      onQueryConsumed?.();
    }
  }, [initialQuery]);

  // Reset page on any filter change
  useEffect(() => { setPage(1); }, [activeTab, activeSlot, selectedOrigin, filterQuery]);

  // Back-to-top visibility
  useEffect(() => {
    const handler = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);


  const getSlot = (tStr: string): TimeSlot => {
    const h = parseInt((tStr || '0').split(':')[0], 10);
    if (h >= 4 && h < 12) return 'morning';
    if (h >= 12 && h < 17) return 'afternoon';
    if (h >= 17 && h < 21) return 'evening';
    return 'night';
  };

  const timeToMinutes = (tStr: string): number => {
    if (!tStr) return 0;
    const [h, m] = tStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const uniqueOrigins = useMemo(() => {
    const set = new Set<string>();
    buses.forEach(b => { if (b.from) set.add(b.from); });
    return Array.from(set).sort();
  }, [buses]);

  const uniqueDestinations = useMemo(() => getUniqueDestinations(buses), [buses]);

  const suggestions = useMemo(() => {
    if (!inputValue.trim()) return [];
    const q = inputValue.toLowerCase();
    return uniqueDestinations
      .filter(d => d.toLowerCase().includes(q))
      .sort((a, b) => {
        const aStart = a.toLowerCase().startsWith(q);
        const bStart = b.toLowerCase().startsWith(q);
        if (aStart && !bStart) return -1;
        if (!aStart && bStart) return 1;
        return a.localeCompare(b);
      })
      .slice(0, 10);
  }, [inputValue, uniqueDestinations]);

  const highlightMatch = (text: string, query: string): React.ReactNode => {
    if (!query.trim()) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="text-rose-600 dark:text-rose-400 font-black">{text.slice(idx, idx + query.length)}</span>
        {text.slice(idx + query.length)}
      </>
    );
  };

  const filteredBuses = useMemo(() => {
    const result = buses.filter(b => {
      if (activeTab === 'starting' && !isStarting(b, currentStation)) return false;
      if (activeTab === 'passing' && isStarting(b, currentStation)) return false;
      if (activeSlot !== 'all' && getSlot(b.time) !== activeSlot) return false;
      if (selectedOrigin !== 'all' && b.from !== selectedOrigin) return false;
      if (filterQuery.trim()) {
        const q = filterQuery.toLowerCase();
        const matchesDest = b.destination.toLowerCase().includes(q);
        const matchesVia = b.via && b.via.toLowerCase().includes(q);
        if (!matchesDest && !matchesVia) return false;
      }
      return true;
    });
    return result.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
  }, [buses, activeTab, activeSlot, selectedOrigin, filterQuery, currentStation]);

  const totalPages = Math.max(1, Math.ceil(filteredBuses.length / PAGE_SIZE));
  const pagedBuses = filteredBuses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const startingCount = useMemo(() => buses.filter(b => isStarting(b, currentStation)).length, [buses, currentStation]);
  const passingCount = buses.length - startingCount;

  const handleSearch = () => {
    setFilterQuery(inputValue);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleDownloadPDF = () => {
    downloadSearchResultsAsPDF(filteredBuses, currentStation, filterQuery || selectedOrigin !== 'all' ? selectedOrigin : '');
  };

  const handleShare = () => {
    shareSearchResults(filteredBuses, currentStation, filterQuery || selectedOrigin !== 'all' ? selectedOrigin : '');
  };

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Tab style helper — uniform height h-11
  const tabClass = (active: boolean, activeColor: string) =>
    `h-11 px-5 rounded-2xl font-black text-sm sm:text-base flex items-center gap-2.5 transition-all shrink-0 ${
      active ? `${activeColor} text-white shadow-md` : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
    }`;

  return (
    <div className="space-y-6" ref={topRef}>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Calendar className="w-7 h-7 text-rose-600 dark:text-rose-400" />
            <span>{t('timetable-title')}</span>
          </h2>
        </div>

        {/* PDF Download & Share Buttons — icon-only, tooltip on hover */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <div className="relative group/dl">
            <button
              onClick={handleDownloadPDF}
              className="btn btn-outline btn-sm px-3"
              title="Download Timetable PDF"
            >
              <Download className="w-4 h-4 text-rose-500" />
            </button>
            <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-lg bg-slate-800 text-white text-xs font-bold whitespace-nowrap opacity-0 group-hover/dl:opacity-100 transition-opacity z-20">
              Download PDF
            </span>
          </div>

          <div className="relative group/sh">
            <button
              onClick={handleShare}
              className="btn btn-outline btn-sm px-3"
              title="Share Search Results"
            >
              <Share2 className="w-4 h-4 text-amber-500" />
            </button>
            <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-lg bg-slate-800 text-white text-xs font-bold whitespace-nowrap opacity-0 group-hover/sh:opacity-100 transition-opacity z-20">
              Share Results
            </span>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewLayout('grid')}
              className={`p-2 rounded-xl transition-colors ${viewLayout === 'grid' ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-white shadow-xs' : 'text-slate-300'}`}
              title="Card Grid View"
            >
              <Grid className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setViewLayout('table')}
              className={`p-2 rounded-xl transition-colors ${viewLayout === 'table' ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-white shadow-xs' : 'text-slate-300'}`}
              title="Table View"
            >
              <List className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Secondary Filter Row */}
      <div className="space-y-4">

        {/* Main Category Tabs — all uniform h-11 */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">

          <button onClick={() => setActiveTab('all')} className={tabClass(activeTab === 'all', 'bg-rose-600')}>
            <span className="w-3 h-3 rounded-full bg-white/80" />
            <span>{t('tab-all')}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${activeTab === 'all' ? 'bg-white text-rose-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
              {buses.length}
            </span>
          </button>

          <button onClick={() => setActiveTab('starting')} className={tabClass(activeTab === 'starting', 'bg-emerald-600')}>
            <span className="w-3 h-3 rounded-full bg-white/80" />
            <span>{t('tab-starting')}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${activeTab === 'starting' ? 'bg-white text-emerald-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
              {startingCount}
            </span>
          </button>

          <button onClick={() => setActiveTab('passing')} className={tabClass(activeTab === 'passing', 'bg-sky-600')}>
            <span className="w-3 h-3 rounded-full bg-white/80" />
            <span>{t('tab-passing')}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${activeTab === 'passing' ? 'bg-white text-sky-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
              {passingCount}
            </span>
          </button>

        </div>

        {/* Secondary Filter Row — Origin | Destination Search | Time */}
        <div className="flex flex-col sm:flex-row gap-3">

          {/* Origin / From Filter — first */}
          <select
            value={selectedOrigin}
            onChange={(e) => setSelectedOrigin(e.target.value)}
            className="h-11 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-bold px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer shrink-0"
          >
            <option value="all">All Origins</option>
            {uniqueOrigins.map((orig) => (
              <option key={orig} value={orig}>From: {orig}</option>
            ))}
          </select>

          {/* Destination Search with manual Search button — second */}
          <div className="relative flex-1 flex gap-2" ref={searchWrapperRef}>
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search destination..."
                className="h-11 w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-10 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
              />
              {inputValue && (
                <button
                  onClick={() => { setInputValue(''); setFilterQuery(''); setShowSuggestions(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-600 transition-colors"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Autocomplete Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400">
                      {suggestions.length} destination{suggestions.length !== 1 ? 's' : ''} found
                    </span>
                    <button onClick={() => setShowSuggestions(false)} className="text-slate-300 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {suggestions.map((dest) => {
                    const count = buses.filter(b => b.destination.toLowerCase() === dest.toLowerCase()).length;
                    return (
                      <button
                        key={dest}
                        onMouseDown={() => {
                          setInputValue(dest);
                          setFilterQuery(dest);
                          setShowSuggestions(false);
                        }}
                        className="w-full px-4 py-3 hover:bg-rose-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between text-sm font-bold transition-colors text-left"
                      >
                        <span className="text-slate-900 dark:text-white">
                          {highlightMatch(dest, inputValue)}
                        </span>
                        <span className="ml-3 shrink-0 px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-black">
                          {count} bus{count !== 1 ? 'es' : ''}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Manual Search Button */}
            <button
              onClick={handleSearch}
              className="btn btn-primary btn-sm h-11 px-5 shrink-0"
              title="Search"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>

          {/* Time Slot Filter — last */}
          <select
            value={activeSlot}
            onChange={(e) => setActiveSlot(e.target.value as TimeSlot)}
            className="h-11 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-bold px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer shrink-0"
          >
            <option value="all">{t('slot-all')}</option>
            <option value="morning">{t('slot-morning')}</option>
            <option value="afternoon">{t('slot-afternoon')}</option>
            <option value="evening">{t('slot-evening')}</option>
            <option value="night">{t('slot-night')}</option>
          </select>

        </div>

        {/* Results count + page info */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
          <span>Showing {pagedBuses.length} of {filteredBuses.length} buses</span>
          {totalPages > 1 && (
            <span>Page {page} of {totalPages}</span>
          )}
        </div>

      </div>

      {/* Bus Grid / Table Layout */}
      {filteredBuses.length > 0 ? (
        viewLayout === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {pagedBuses.map((bus) => (
              <TimetableCard
                key={bus.id || `${bus.time}-${bus.destination}`}
                bus={bus}
                currentStation={currentStation}
                onOpenModal={onOpenModal}
                t={t}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm sm:text-base">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-4">Time</th>
                    <th className="p-4">Origin (From)</th>
                    <th className="p-4">Destination (To)</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Via Stops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold">
                  {pagedBuses.map((bus) => {
                    const starting = isStarting(bus, currentStation);
                    return (
                      <tr 
                        key={bus.id} 
                        onClick={() => onOpenModal(bus)}
                        className="hover:bg-rose-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group/row"
                      >
                        <td className="p-4 font-black text-rose-600 dark:text-rose-400 text-base sm:text-lg whitespace-nowrap">
                          {bus.time}
                        </td>
                        <td className="p-4 font-extrabold text-slate-900 dark:text-white">
                          {bus.from || currentStation.label.split(' ')[0]}
                        </td>
                        <td className="p-4 font-black text-slate-900 dark:text-white text-base sm:text-lg">
                          {bus.destination}
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 rounded-lg text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {bus.service || 'Express'}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-black ${
                            starting
                              ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                              : 'bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400'
                          }`}>
                            {starting ? t('starting-badge') : t('passing-badge')}
                          </span>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-400 min-w-[250px] max-w-sm font-medium whitespace-normal break-words leading-relaxed">
                          {bus.via || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6">
          <Filter className="w-14 h-14 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-300">
            No buses matched your selected filters.
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Try resetting the origin, time slot, or search keyword to view available schedules.
          </p>
          <button
            onClick={() => {
              setActiveTab('all');
              setActiveSlot('all');
              setSelectedOrigin('all');
              setInputValue('');
              setFilterQuery('');
            }}
            className="mt-4 btn btn-primary btn-sm"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => { setPage(p => Math.max(1, p - 1)); scrollToTop(); }}
            disabled={page === 1}
            className="btn btn-outline btn-sm disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>
          <span className="text-sm font-black text-slate-700 dark:text-slate-300 px-4">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => { setPage(p => Math.min(totalPages, p + 1)); scrollToTop(); }}
            disabled={page === totalPages}
            className="btn btn-outline btn-sm disabled:opacity-40"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Back-to-Top Floating Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 btn btn-primary p-3 rounded-2xl shadow-xl"
          title="Back to top"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

    </div>
  );
};
