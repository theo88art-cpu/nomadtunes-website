'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Instagram, Music2 } from 'lucide-react';
import { useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { ARTISTS } from '@/lib/data';
import { Reveal } from '@/components/reveal';

export function Artists() {
  const { t } = useLanguage();
  const tr = t.artists;
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'l' | 'r') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'l' ? -340 : 340, behavior: 'smooth' });
  };

  return (
    <section id="artists" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mb-12 flex items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ff6a00]">
              {tr.label}
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              {tr.title}
            </h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button onClick={() => scroll('l')} className="flex h-11 w-11 items-center justify-center rounded-full glass text-white transition-colors hover:bg-white/10" aria-label={tr.prev}>
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => scroll('r')} className="flex h-11 w-11 items-center justify-center rounded-full glass text-white transition-colors hover:bg-white/10" aria-label={tr.next}>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </Reveal>

        <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
          {ARTISTS.map((artist, i) => (
            <motion.a
              key={artist.name}
              href={artist.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group relative block w-[280px] flex-shrink-0 snap-start cursor-pointer rounded-3xl transition-transform duration-300 hover:scale-[1.03] hover:-translate-y-1"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={artist.image} alt={artist.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <span className="w-fit rounded-full glass px-2.5 py-1 text-xs text-white/80">
                    {artist.flag} {artist.country}
                  </span>
                  {artist.socials && (
                    <div className="mt-3 flex gap-2">
                      {artist.socials.instagram && (
                        <a
                          href={artist.socials.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Instagram"
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-all duration-300 hover:bg-[#ff6a00] hover:scale-110 cursor-pointer"
                        >
                          <Instagram className="h-4 w-4" />
                        </a>
                      )}
                      {artist.socials.tiktok && (
                        <a
                          href={artist.socials.tiktok}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          aria-label="TikTok"
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-all duration-300 hover:bg-[#ff6a00] hover:scale-110 cursor-pointer"
                        >
                          <Music2 className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                  <h3 className="mt-3 font-display text-xl font-bold text-white">{artist.name}</h3>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
