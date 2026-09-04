import React, { useState } from 'react';
import { Bus, MapPin, Clock, Sun, Moon, Languages, Menu, X, Home, Calendar, Info, ChevronDown, Type, Settings } from 'lucide-react';
import { ViewType, Language } from '../types/bus';
import { STATIONS } from '../utils/constants';
import { useLiveClock } from '../hooks/useLiveClock';
import { useWeather } from '../hooks/useWeather';
import { FontSizeLevel, TimeFormatMode } from '../hooks/useAccessibility';

interface HeaderProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  currentStandKey: string;
  setCurrentStandKey: (key: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
  fontSize: FontSizeLevel;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  timeFormat: TimeFormatMode;
  toggleTimeFormat: () => void;
  t: (key: string) => string;
  totalBusesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  currentStandKey,
  setCurrentStandKey,
  theme,
  toggleTheme,
  language,
  toggleLanguage,
  fontSize,
  increaseFontSize,
  decreaseFontSize,
  timeFormat,
  toggleTimeFormat,
  t,
  totalBusesCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { time } = useLiveClock();
  const weather = useWeather(currentStandKey);

  interface NavItem {
    id: ViewType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }

  const navItems: NavItem[] = [
    { id: 'home', label: t('nav-home'), icon: Home },
    { id: 'timetable', label: t('nav-timetable'), icon: Calendar, badge: totalBusesCount },
    { id: 'stations', label: t('nav-stations'), icon: MapPin },
    { id: 'about', label: t('nav-about'), icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 dark:bg-slate-950/95 text-white backdrop-blur-md border-b border-slate-800 shadow-2xl transition-colors">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          
          {/* Brand Logo & Title - Removed "Official Portal" badge */}
          <div 
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-rose-600 to-red-700 flex items-center justify-center shadow-lg shadow-rose-900/40 group-hover:scale-105 transition-transform">
              <Bus className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white group-hover:text-rose-400 transition-colors">
                {t('app-title')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-bold mt-0.5">
                {t('app-subtitle')}
              </p>
            </div>
          </div>

          {/* Desktop Controls - Structured & Harmonious Row */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Weather Pill */}
            <div 
              className="flex items-center gap-2 px-3.5 h-10 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs sm:text-sm font-bold text-slate-300 shadow-inner"
              title={`Weather in ${currentStandKey}: ${weather.condition}`}
            >
              <span className="text-base">{weather.icon}</span>
              <span>{weather.temp}°C</span>
            </div>

            {/* Bus Stand Selector */}
            <div className="relative">
              <select
                value={currentStandKey}
                onChange={(e) => setCurrentStandKey(e.target.value)}
                className="appearance-none bg-slate-700 hover:bg-slate-600 text-white font-black text-xs sm:text-sm pl-4 pr-10 h-10 rounded-2xl border border-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-md cursor-pointer transition-colors"
                aria-label="Select Bus Stand"
              >
                {STATIONS.map((s) => (
                  <option key={s.key} value={s.key} className="bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-white font-bold">
                    {s.emoji} {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-white absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Live Ticking Clock */}
            <div className="flex items-center gap-2 px-3.5 h-10 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs sm:text-sm font-extrabold text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <Clock className="w-4 h-4" />
              <span className="font-mono text-sm sm:text-base">{time || '--:--:--'}</span>
            </div>

            {/* Settings Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="btn btn-icon"
                title="Display & Accessibility Settings"
                aria-label="Settings"
              >
                <Settings className="w-4.5 h-4.5 text-slate-300" />
              </button>
              
              {settingsOpen && (
                <div className="absolute top-full right-0 mt-3 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Theme</span>
                    <button onClick={toggleTheme} className="btn btn-secondary btn-sm flex items-center gap-2">
                      {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-sky-500" />}
                      <span className="text-xs">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Language</span>
                    <button onClick={toggleLanguage} className="btn btn-secondary btn-sm flex items-center gap-2">
                      <Languages className="w-4 h-4 text-rose-400" />
                      <span className="uppercase text-xs">{language}</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Format</span>
                    <button onClick={toggleTimeFormat} className="btn btn-secondary btn-sm text-rose-400">
                      {timeFormat.toUpperCase()}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Text Size</span>
                    <div className="flex items-center bg-slate-800 rounded-xl border border-slate-700 p-0.5">
                      <button onClick={decreaseFontSize} disabled={fontSize === 'normal'} className="btn btn-ghost btn-sm px-2 py-1 text-xs font-black rounded-lg disabled:opacity-40">A-</button>
                      <div className="w-px h-3 bg-slate-600 mx-1"></div>
                      <button onClick={increaseFontSize} disabled={fontSize === 'xlarge'} className="btn btn-ghost btn-sm px-2 py-1 text-xs font-black rounded-lg disabled:opacity-40">A+</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-icon text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Navigation Links Bar (Desktop) */}
      <div className="hidden lg:block bg-slate-950/90 border-t border-slate-800/80">
        <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 py-2.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as ViewType)}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-black text-sm sm:text-base transition-all ${
                    isActive
                      ? 'bg-slate-800 text-white border-b-2 border-rose-500 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-rose-400' : 'text-slate-300'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 pt-4 pb-6 space-y-4">
          <div className="pb-3 border-b border-slate-800 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Select Bus Stand:
              </label>
              <select
                value={currentStandKey}
                onChange={(e) => {
                  setCurrentStandKey(e.target.value);
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-slate-800 text-white text-base font-bold py-3 px-4 rounded-xl border border-slate-700"
              >
                {STATIONS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.emoji} {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Settings Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-500" />
                  Theme:
                </span>
                <button onClick={toggleTheme} className="btn btn-secondary btn-sm text-xs w-20">
                  {theme === 'dark' ? 'Light' : 'Dark'}
                </button>
              </div>

              <div className="flex items-center justify-between bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Languages className="w-4 h-4 text-rose-400" />
                  Language:
                </span>
                <button onClick={toggleLanguage} className="btn btn-secondary btn-sm text-xs uppercase w-20">
                  {language}
                </button>
              </div>

              <div className="flex items-center justify-between bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  Time Format:
                </span>
                <button onClick={toggleTimeFormat} className="btn btn-secondary btn-sm text-xs w-20">
                  {timeFormat.toUpperCase()}
                </button>
              </div>

              {/* Font Size Adjuster in Mobile Menu */}
              <div className="flex items-center justify-between bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-sky-500" />
                  Text Size:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={decreaseFontSize}
                    disabled={fontSize === 'normal'}
                    className="px-3 py-1 bg-slate-700 text-white text-xs font-bold rounded-lg disabled:opacity-40"
                  >
                    A-
                  </button>
                  <span className="text-xs font-bold text-rose-400 uppercase">
                    {fontSize}
                  </span>
                  <button
                    onClick={increaseFontSize}
                    disabled={fontSize === 'xlarge'}
                    className="px-3 py-1 bg-slate-700 text-white text-xs font-bold rounded-lg disabled:opacity-40"
                  >
                    A+
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id as ViewType);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold ${
                    isActive ? 'bg-rose-600 text-white font-extrabold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="px-2.5 py-0.5 text-xs rounded-full bg-slate-800 text-white font-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-sm font-bold text-white bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700"
            >
              <Languages className="w-4 h-4 text-rose-400" />
              <span>Language: {language === 'en' ? 'English' : 'ಕನ್ನಡ'}</span>
            </button>
            <div className="text-sm text-rose-400 font-mono font-bold">
              🕒 {time}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
