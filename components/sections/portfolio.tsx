'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, Play, Camera, Mic2, Video } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { PORTFOLIO } from '@/lib/data';
import { Reveal } from '@/components/reveal';

const TYPE_ICON: Record<string, typeof Camera> = {
  'Music Video': Video,
  Freestyle: Mic2,
  'Studio Session': Mic2,
  Photo: Camera,
};

const TYPE_KEYS: Record<string, 'typeMusicVideo' | 'typeFreestyle' | 'typeStudioSession' | 'typePhoto'> = {
  'Music Video': 'typeMusicVideo',
  Freestyle: 'typeFreestyle',
  'Studio Session': 'typeStudioSession',
  Photo: 'typePhoto',
};

const SPAN_CLASS: Record<string, string> = {
  tall: 'row-span-2',
  wide: 'col-span-2',
  normal: '',
};

export function Portfolio() {
  const { t } = useLanguage();
  const tr = t.portfolio;
  const [active, setActive] = useState<(typeof PORTFOLIO)[number] | null>(null);

  return (
    <section id="portfolio" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mb-12 max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ff6a00]">
            {tr.label}
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            {tr.title}
          </h2>
        </Reveal>

        <div className="grid auto-rows-[220px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {PORTFOLIO.map((item, i) => {
            const Icon = TYPE_ICON[item.type] || Camera;
            const typeKey = TYPE_KEYS[item.type] || 'typePhoto';
            return (
              <Reveal key={i} delay={(i % 4) * 0.06} className={SPAN_CLASS[item.span] || ''}>
                <motion.button
                  onClick={() => setActive(item)}
                  whileHover={{ y: -5 }}
                  className="group relative h-full w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
  src={item.image}
  alt={item.title}
  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full glass px-2.5 py-1">
                    <Icon className="h-3 w-3 text-[#ff6a00]" />
                    <span className="text-[10px] font-medium text-white/80">{tr[typeKey]}</span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                    <p className="text-sm font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
  {item.title}
</p>
                  </div>
                </motion.button>
              </Reveal>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10"
            >
              <button onClick={() => setActive(null)} className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full glass text-white hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={active.image} alt={active.title} className="max-h-[85vh] w-full object-contain" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex items-center gap-2 text-sm text-[#ff6a00]">
                  <Play className="h-4 w-4 fill-[#ff6a00]" />
                  {tr[TYPE_KEYS[active.type] || 'typePhoto']}
                </div>
                <h3 className="mt-1 font-display text-2xl font-bold text-white">{active.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
