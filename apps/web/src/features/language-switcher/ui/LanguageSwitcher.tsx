/**
 * @file LanguageSwitcher.tsx
 * @description Enterprise language selector popover (EN / ES / DE) with sharp square aesthetics.
 */

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/app/providers/LanguageProvider';
import { Globe, ChevronDown, Check } from 'lucide-react';
import type { SupportedLocale } from '@/shared/i18n';

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { locale, setLocale, availableLanguages, t } = useTranslation();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = availableLanguages.find((l) => l.code === locale) ?? availableLanguages[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Enterprise Square Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-none border border-slate-700/80 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono font-medium transition-colors cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={t.header.selectLanguage}
      >
        <Globe className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-mono text-xs uppercase font-semibold">{currentLang.code}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Enterprise Square Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 rounded-none bg-slate-950 border border-slate-700 shadow-2xl z-50 overflow-hidden animate-in fade-in duration-100">
          <div className="px-3 py-2 border-b border-slate-800 bg-slate-900/60">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
              {t.header.selectLanguage}
            </p>
          </div>

          <div className="p-1 space-y-0.5 font-mono">
            {availableLanguages.map((lang) => {
              const isSelected = lang.code === locale;

              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLocale(lang.code as SupportedLocale);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-none flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 text-white font-bold'
                      : 'hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{lang.flag}</span>
                    <div className="text-xs">
                      <div>{lang.nativeName}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono">{lang.code}</div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
