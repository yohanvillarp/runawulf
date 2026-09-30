/**
 * @file LanguageProvider.tsx
 * @description Language context provider managing active locale and typed translations.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  DICTIONARIES,
  SUPPORTED_LANGUAGES,
  type SupportedLocale,
  type LanguageInfo,
  type TranslationDictionary,
} from '@/shared/i18n';

interface LanguageContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  availableLanguages: LanguageInfo[];
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    try {
      const saved = localStorage.getItem('runawulf_locale') as SupportedLocale;
      if (saved && (saved === 'en' || saved === 'es' || saved === 'de')) {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'en'; // English is the primary default language
  });

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('runawulf_locale', newLocale);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = DICTIONARIES[locale] ?? DICTIONARIES.en;

  return (
    <LanguageContext.Provider value={{ locale, setLocale, availableLanguages: SUPPORTED_LANGUAGES, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return ctx;
}
