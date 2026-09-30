/**
 * @file index.ts
 * @description Public API and catalog for Runawulf internationalization.
 */

import { en } from './locales/en.js';
import { es } from './locales/es.js';
import { de } from './locales/de.js';
import type { SupportedLocale, LanguageInfo, TranslationDictionary } from './types.js';

export * from './types.js';

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
];

export const DICTIONARIES: Record<SupportedLocale, TranslationDictionary> = {
  en,
  es,
  de,
};
