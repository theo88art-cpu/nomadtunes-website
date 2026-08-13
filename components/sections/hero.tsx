'use client';

import { motion } from 'framer-motion';
import { MapPin, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { IMAGES } from '@/lib/data';
import { supabase } from '@/lib/supabase';

export function Hero() {
  const { t } = useLanguage();
  const tr = t.hero;
  const [location, setLocation] = useState<{ city: string; country: string } | null>(null);

  useEffect(() => {
    async function loadLocation() {
      const { data } = await supabase
        .from('site_location')
        .select('city,country')
        .limit(1)
        .maybeSingle();

      if (data) setLocation(data as { city: string; country: string });
    }

    loadLocation();
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden pt-60 pb-20"
    >
      {/* glow background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-10%] top-[20%] h-[600px] w-[600px] rounded-full bg-[#ff6a00]/20 blur-[140px]" />
        <div className="absolute left-[-5%] bottom-[10%] h-[400px] w-[400px] rounded-full bg-[#ff6a00]/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-8">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="z-10 order-2 lg:order-1"
        >
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.2rem]">
            {tr.title1}{' '}
            <span className="text-gradient-orange">{tr.titleHighlight}</span>{' '}
            {tr.title2}
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/60">
            {tr.subtitle}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#roadtrip"
              className="group inline-flex items-center justify-center gap-2 rounded-full glass px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              <Play className="h-4 w-4 fill-[#ff6a00] text-[#ff6a00]" />
              {tr.btnRoadtrip}
            </a>
          </div>

          <div className="mt-12 flex items-center gap-8">
            {[
              { n: '8', l: tr.statCountries },
              { n: '54+', l: tr.statSongs },
              { n: '2,760 km', l: tr.statTravelled },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-2xl font-bold text-white">
                  {s.n}
                </div>
                <div className="text-xs text-white/40">{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT — camper van */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative order-1 lg:order-2"
        >
          <div className="relative">
            {/* glow */}
            <div className="absolute inset-0 -z-10 scale-110 rounded-full bg-[#ff6a00]/25 blur-[100px]" />

            <motion.div
              animate={{ y: [0, -18, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="overflow-hidden rounded-[2rem] border border-white/10 glow-orange-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={IMAGES.heroVan}
                  alt={tr.altVan}
                  className="h-[300px] w-full object-cover sm:h-[400px] lg:h-[520px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* floating badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
                className="absolute -left-3 bottom-10 glass rounded-2xl p-3 sm:-left-6"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff6a00]/20">
                    <MapPin className="h-4 w-4 text-[#ff6a00]" />
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-white">
                      {location ? `${location.city}, ${location.country}` : tr.badgeLocation}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 p-1.5">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-2 w-1 rounded-full bg-[#ff6a00]"
          />
        </div>
      </motion.div>
    </section>
  );
}
