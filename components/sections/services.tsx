'use client';

import { motion } from 'framer-motion';
import {
  Mic,
  SlidersHorizontal,
  AudioWaveform,
  Piano,
  type LucideIcon,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { SERVICES } from '@/lib/data';
import { Reveal } from '@/components/reveal';

const ICONS: Record<string, LucideIcon> = {
  Mic,
  SlidersHorizontal,
  AudioWaveform,
  Piano,
};

const TITLE_KEYS = ['recordingTitle', 'mixingTitle', 'masteringTitle', 'productionTitle'] as const;
const DESC_KEYS = ['recordingDesc', 'mixingDesc', 'masteringDesc', 'productionDesc'] as const;

export function Services() {
  const { t } = useLanguage();
  const tr = t.services;

  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mb-16 max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ff6a00]">
            {tr.label}
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            {tr.title}
          </h2>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.icon];
            return (
              <Reveal key={s.icon} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-7 transition-colors hover:border-[#ff6a00]/30"
                >
                  {/* hover glow */}
                  <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#ff6a00]/0 blur-[60px] transition-all duration-500 group-hover:bg-[#ff6a00]/20" />

                  <div className="relative">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff8c2a]/20 to-[#ff6a00]/10 ring-1 ring-[#ff6a00]/20 transition-all group-hover:glow-orange-sm">
                      {Icon && <Icon className="h-6 w-6 text-[#ff6a00]" />}
                    </div>
                    <h3 className="font-display text-xl font-bold text-white">
                      {tr[TITLE_KEYS[i]]}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/50">
                      {tr[DESC_KEYS[i]]}
                      {TITLE_KEYS[i] === 'productionTitle' && (
                        <>
                          {' '}
                          <a
                            href={tr.productionLinkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-[#ff6a00] underline-offset-2 hover:text-[#ff8c2a] hover:underline cursor-pointer transition-colors"
                          >
                            {tr.productionLinkText}
                          </a>
                        </>
                      )}
                    </p>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
