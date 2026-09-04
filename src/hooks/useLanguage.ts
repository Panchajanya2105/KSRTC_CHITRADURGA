import { useState, useEffect } from 'react';
import { Language } from '../types/bus';
import { TRANSLATIONS } from '../utils/i18n';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('ksrtc_lang') as Language;
    return saved === 'kn' ? 'kn' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('ksrtc_lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'kn' : 'en'));
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return { language, setLanguage, toggleLanguage, t };
}
