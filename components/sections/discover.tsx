'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Quote, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { IMAGES } from '@/lib/data';
import { Reveal } from '@/components/reveal';

export function Discover() {
  const { t } = useLanguage();
  const tr = t.discover;

  const REELS = [
    {
      title: tr.reel1Title,
      image: IMAGES.videoReel1,
      tag: tr.reel1Tag,
      src: IMAGES.videoReel1Mp4,
    },
    {
      title: tr.reel2Title,
      image: IMAGES.videoReel2,
      tag: tr.reel2Tag,
      src: IMAGES.videoReel2Mp4,
    },
  ];

  return (
    <section id="discover" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mb-16 max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ff6a00]">
            {tr.label}
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            {tr.title}
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {REELS.map((reel, i) => (
            <Reveal key={reel.title} delay={i * 0.15}>
              <VideoCard reel={reel} watchLabel={tr.watchReel} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

type Reel = {
  title: string;
  image: string;
  tag: string;
  src: string;
};

function VideoCard({
  reel,
  watchLabel,
}: {
  reel: Reel;
  watchLabel: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
    } else {
      v.play();
    }
    setPlaying(!playing);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <div>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="group relative aspect-[9/16] max-h-[560px] overflow-hidden rounded-[1.75rem] glass"
      >
        <video
          ref={videoRef}
          src={`${reel.src}#t=0.1`}
          playsInline
          loop
          muted={muted}
          preload="metadata"
          onClick={togglePlay}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="absolute inset-0 h-full w-full cursor-pointer object-cover"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />

        <div className="absolute left-5 top-5">
          <span className="rounded-full glass px-3 py-1 text-xs font-medium text-white/80">
            {reel.tag}
          </span>
        </div>

        {/* mute toggle */}
        {playing && (
          <button
            onClick={toggleMute}
            className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full glass text-white/80 transition hover:text-white"
            aria-label="Toggle sound"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.15 }}
            onClick={togglePlay}
            className={`flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-[#ff6a00] glow-orange transition-opacity ${
              playing ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <Play className="h-6 w-6 fill-white text-white" />
          </motion.div>
        </div>
      </motion.div>

      <div className="mt-4 flex items-center gap-2">
        <Quote className="h-4 w-4 shrink-0 text-[#ff6a00]" />
        <p className="text-base font-semibold leading-snug text-white">
          {reel.title}
        </p>
      </div>
      <p className="mt-1 pl-6 text-xs text-white/50">{watchLabel}</p>
    </div>
  );
}
