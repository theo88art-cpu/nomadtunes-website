'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import type { Language } from '@/context/LanguageContext';

const LOCALES: { code: Language; flag: string; labelKey: 'fr' | 'en' }[] = [
  { code: 'fr', flag: '🇫🇷', labelKey: 'fr' },
  { code: 'en', flag: '🇬🇧', labelKey: 'en' },
];

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const switchTo = (newLocale: Language) => {
    setOpen(false);
    if (newLocale === language) return;
    setLanguage(newLocale);
  };

  const current = LOCALES.find((l) => l.code === language) ?? LOCALES[1];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t.language.switcherLabel}
        className="flex items-center gap-1.5 rounded-full glass px-3 py-2 text-sm font-medium text-white/70 transition-all hover:text-white hover:border-[#ff6a00]/30"
      >
        <Globe className="h-4 w-4 text-[#ff6a00]" />
        <span className="hidden sm:inline">{current.flag}</span>
        <span className="hidden md:inline">{t.language[current.labelKey]}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-2xl">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => switchTo(l.code)}
              className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-sm transition-colors hover:bg-[#ff6a00]/10 ${
                l.code === language ? 'text-white' : 'text-white/60'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span className="text-base">{l.flag}</span>
                {t.language[l.labelKey]}
              </span>
              {l.code === language && (
                <Check className="h-4 w-4 text-[#ff6a00]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
