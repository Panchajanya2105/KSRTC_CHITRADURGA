import { useState, useEffect } from 'react';

export type FontSizeLevel = 'normal' | 'large' | 'xlarge';
export type TimeFormatMode = '12h' | '24h';

export function useAccessibility() {
  const [fontSize, setFontSize] = useState<FontSizeLevel>(() => {
    return (localStorage.getItem('ksrtc_font_size') as FontSizeLevel) || 'large';
  });

  const [timeFormat, setTimeFormat] = useState<TimeFormatMode>(() => {
    return (localStorage.getItem('ksrtc_time_format') as TimeFormatMode) || '12h';
  });

  useEffect(() => {
    localStorage.setItem('ksrtc_font_size', fontSize);
    const root = document.documentElement;
    root.classList.remove('font-scale-normal', 'font-scale-large', 'font-scale-xlarge');
    root.classList.add(`font-scale-${fontSize}`);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('ksrtc_time_format', timeFormat);
  }, [timeFormat]);

  const increaseFontSize = () => {
    if (fontSize === 'normal') setFontSize('large');
    else if (fontSize === 'large') setFontSize('xlarge');
  };

  const decreaseFontSize = () => {
    if (fontSize === 'xlarge') setFontSize('large');
    else if (fontSize === 'large') setFontSize('normal');
  };

  const toggleTimeFormat = () => {
    setTimeFormat(prev => (prev === '12h' ? '24h' : '12h'));
  };

  const formatBusTime = (timeStr: string): string => {
    if (!timeStr) return '—';
    const [hStr, mStr] = timeStr.split(':');
    const h = parseInt(hStr || '0', 10);
    const m = parseInt(mStr || '0', 10);

    if (timeFormat === '24h') {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} hrs`;
    }

    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
  };

  return {
    fontSize,
    setFontSize,
    increaseFontSize,
    decreaseFontSize,
    timeFormat,
    toggleTimeFormat,
    formatBusTime
  };
}
