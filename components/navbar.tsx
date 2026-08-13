'use client';

import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { SITE } from '@/lib/data';
import { LanguageSwitcher } from '@/components/language-switcher';

const LINK_KEYS = ['services', 'roadtrip', 'artists', 'portfolio', 'contest', 'contact'] as const;

export function Navbar() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (v) => {
    setScrolled(v > 40);
  });

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass py-3' : 'py-5 bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#hero" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo_optimized.png" alt={SITE.name} className="-ml-2 h-[65px] w-auto object-contain" />
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {LINK_KEYS.map((key) => (
            <a
              key={key}
              href={`#${key}`}
              className="text-sm text-white/60 transition-colors hover:text-[#ff6a00]"
            >
              {t.nav[key]}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <a
            href="#contest"
            className="rounded-full bg-[#ff6a00] px-5 py-2 text-sm font-semibold text-white transition-all hover:scale-105 hover:glow-orange-sm"
          >
            {t.nav.winMix}
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-white"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="glass mt-3 mx-4 rounded-2xl p-5 lg:hidden"
        >
          <div className="flex flex-col gap-4">
            {LINK_KEYS.map((key) => (
              <a
                key={key}
                href={`#${key}`}
                onClick={() => setOpen(false)}
                className="text-sm text-white/70 hover:text-[#ff6a00]"
              >
                {t.nav[key]}
              </a>
            ))}
            <a
              href="#contest"
              onClick={() => setOpen(false)}
              className="text-sm font-semibold text-[#ff6a00]"
            >
              {t.nav.winMix}
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
