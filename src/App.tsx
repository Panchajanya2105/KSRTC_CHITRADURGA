import React, { useState, useEffect } from 'react';
import { ViewType, Bus } from './types/bus';
import { STATIONS } from './utils/constants';
import { useTheme } from './hooks/useTheme';
import { useLanguage } from './hooks/useLanguage';
import { useBusData } from './hooks/useBusData';
import { useAccessibility } from './hooks/useAccessibility';

import { Header } from './components/Header';
import { AnnouncementBar } from './components/AnnouncementBar';
import { HomeView } from './components/Views/HomeView';
import { TimetableView } from './components/Views/TimetableView';
import { StationsView } from './components/Views/StationsView';
import { AboutView } from './components/Views/AboutView';
import { BusDetailModal } from './components/BusDetailModal';
import { Toast } from './components/Toast';
import { Bus as BusIcon, Printer, Mail, PhoneCall } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    return (localStorage.getItem('ksrtc_current_view') as ViewType) || 'home';
  });
  const [currentStandKey, setCurrentStandKey] = useState<string>(() => {
    return localStorage.getItem('ksrtc_current_stand') || 'chitradurga';
  });

  useEffect(() => {
    localStorage.setItem('ksrtc_current_view', currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('ksrtc_current_stand', currentStandKey);
  }, [currentStandKey]);
  const [selectedBusForModal, setSelectedBusForModal] = useState<Bus | null>(null);
  const [timetableQuery, setTimetableQuery] = useState<string>('');

  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { currentData, loading, error, stationDataMap, lastUpdated } = useBusData(currentStandKey);
  const {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    timeFormat,
    toggleTimeFormat,
    formatBusTime
  } = useAccessibility();

  const [toast, setToast] = useState<{ message: string | null; type: 'success' | 'info' | 'warning' }>({
    message: null,
    type: 'info'
  });

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: null, type: 'info' }), 3000);
  };

  const currentStationInfo = STATIONS.find(s => s.key === currentStandKey) || STATIONS[0];
  const buses = currentData?.buses || [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Top Header & Navigation */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentStandKey={currentStandKey}
        setCurrentStandKey={(key) => {
          setCurrentStandKey(key);
          showToast(`Switched to ${STATIONS.find(s => s.key === key)?.label}`, 'info');
        }}
        theme={theme}
        toggleTheme={toggleTheme}
        language={language}
        toggleLanguage={toggleLanguage}
        fontSize={fontSize}
        increaseFontSize={increaseFontSize}
        decreaseFontSize={decreaseFontSize}
        timeFormat={timeFormat}
        toggleTimeFormat={toggleTimeFormat}
        t={t}
        totalBusesCount={buses.length}
      />

      {/* Ticker Notice Bar */}
      <AnnouncementBar />

      {/* Main Body View Container */}
      <main className="flex-1 max-w-[1550px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-base font-extrabold text-slate-700 dark:text-slate-300">
              Loading schedules for {currentStationInfo.label}...
            </p>
          </div>
        ) : error ? (
          <div className="p-6 bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-900 rounded-2xl text-center">
            <p className="text-rose-700 dark:text-rose-300 font-extrabold text-base">{error}</p>
          </div>
        ) : (
          <>
            {currentView === 'home' && (
              <HomeView
                currentStation={currentStationInfo}
                buses={buses}
                onOpenModal={setSelectedBusForModal}
                setCurrentView={setCurrentView}
                setTimetableQuery={setTimetableQuery}
                t={t}
              />
            )}

            {currentView === 'timetable' && (
              <TimetableView
                currentStation={currentStationInfo}
                buses={buses}
                onOpenModal={setSelectedBusForModal}
                initialQuery={timetableQuery}
                onQueryConsumed={() => setTimetableQuery('')}
                t={t}
              />
            )}

            {currentView === 'stations' && (
              <StationsView
                currentStandKey={currentStandKey}
                setCurrentStandKey={setCurrentStandKey}
                setCurrentView={setCurrentView}
                stationDataMap={stationDataMap}
                t={t}
              />
            )}

            {currentView === 'about' && (
              <AboutView t={t} />
            )}
          </>
        )}
      </main>

      {/* Floating Offline capability & Data Freshness Banner */}
      {lastUpdated && (
        <div className="fixed bottom-4 right-4 z-40 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 shadow-lg py-2 px-4 rounded-full text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2 animate-fadeIn pointer-events-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Last updated: {
            Math.floor((new Date().getTime() - lastUpdated.getTime()) / (1000 * 60)) < 1 
              ? 'Just now' 
              : `${Math.floor((new Date().getTime() - lastUpdated.getTime()) / (1000 * 60))} mins ago`
          }
        </div>
      )}

      {/* Bus Route Detail Modal */}
      <BusDetailModal
        bus={selectedBusForModal}
        currentStation={currentStationInfo}
        onClose={() => setSelectedBusForModal(null)}
        t={t}
      />

      {/* Notification Toast */}
      <Toast message={toast.message} type={toast.type} />

      {/* Footer */}
      <footer className="mt-12 bg-slate-900 dark:bg-slate-950 text-slate-400 text-xs sm:text-sm border-t border-slate-800 py-8">
        <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                <BusIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-white text-base block">KSRTC Chitradurga Division</span>
                <span className="text-slate-300 text-xs font-semibold">Chitradurga • Challakere • Hiriyuru • Holalkere • Bharamasagara • Hosadurga</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center sm:justify-end items-center gap-8 text-xs sm:text-sm font-bold">
              <span className="flex items-center gap-1.5 text-slate-200">
                <Printer className="w-4 h-4 text-slate-400" />
                <span>Fax: 08194-222500</span>
              </span>
              <span className="flex items-start gap-1.5 text-slate-200">
                <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                <span className="flex flex-col space-y-0.5">
                  <span>dccdg@ksrtc.org</span>
                  <span>aocdg@ksrtc.org</span>
                </span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-200">
                <PhoneCall className="w-4 h-4 text-slate-400" />
                <span>Toll-Free: 080-26252625</span>
              </span>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-800 text-center text-slate-400 text-xs font-semibold space-y-1.5">
            <p>
              &copy; {new Date().getFullYear()} Timetable data on the basis of{' '}
              <a href="https://ksrtc.karnataka.gov.in/49/time-table/en" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-400 hover:underline">
                ksrtc.karnataka.gov.in
              </a>
            </p>
            <p className="text-slate-500">Not an official KSRTC portal. No partners. No ads.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
