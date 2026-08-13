'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { TESTIMONIALS } from '@/lib/data';
import { Reveal } from '@/components/reveal';

export function Testimonials() {
  const { t } = useLanguage();
  const tr = t.testimonials;

  return (
    <section id="testimonials" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mb-16 max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ff6a00]">
            {tr.label}
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            {tr.title}
          </h2>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {TESTIMONIALS.map((tm, i) => (
            <Reveal key={tm.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-7"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#ff6a00]/0 blur-[50px] transition-all duration-500 group-hover:bg-[#ff6a00]/10" />

                <Quote className="h-8 w-8 text-[#ff6a00]/30" />

                <div className="mt-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className="h-4 w-4 fill-[#ff6a00] text-[#ff6a00]"
                    />
                  ))}
                </div>

                <p className="mt-4 text-base leading-relaxed text-white/70">
                  &ldquo;{tr.items[i]}&rdquo;
                </p>

                <div className="mt-6 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tm.image}
                    alt={tm.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-[#ff6a00]/20"
                  />
                  <div>
                    <div className="font-semibold text-white">{tm.name}</div>
                    <div className="text-xs text-white/40">{tr.roles[i]}</div>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
