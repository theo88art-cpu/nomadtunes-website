'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Reveal } from '@/components/reveal';
import {
  ROADTRIP_STATS,
  MAP_CITIES,
  ROADTRIP_DATA,
  type Artist,
} from '@/lib/roadtrip-data';

const EUROPE_CENTER: [number, number] = [50, 8];
const DEFAULT_ZOOM = 4;

export function Roadtrip() {
  const { t } = useLanguage();
  const tr = t.roadtrip;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = useMemo(
    () => [
      { n: String(ROADTRIP_STATS.countries), l: tr.statCountries },
      { n: String(ROADTRIP_STATS.cities), l: tr.statCities },
      { n: String(ROADTRIP_STATS.songs), l: tr.statSongs },
    ],
    [tr],
  );

  return (
    <section id="roadtrip" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff6a00]/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mb-12 max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ff6a00]">
            {tr.label}
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            {tr.title1} <br />
            <span className="text-gradient-orange">{tr.titleHighlight}</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/55">
            {tr.description}
          </p>
        </Reveal>

        <Reveal className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#070707]">
          <div className="noise-bg absolute inset-0 opacity-[0.03]" />

          <div className="relative h-[400px] w-full sm:h-[560px] lg:h-[640px]">
            {mounted && <LeafletMap center={EUROPE_CENTER} zoom={DEFAULT_ZOOM} />}
          </div>

          {/* Legend */}
          <div className="absolute right-4 top-4 z-[500] flex flex-col gap-2 sm:right-6 sm:top-6">
            <div className="flex items-center gap-2 rounded-full glass px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-[#ff6a00] glow-orange-sm" />
              <span className="text-xs text-white/60">{tr.legendVisited}</span>
            </div>
          </div>
        </Reveal>

        {/* Auto-calculated stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {stats.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.08}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-center">
                <div className="font-display text-2xl font-bold text-gradient-orange">{s.n}</div>
                <div className="mt-1 text-xs text-white/40">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// LeafletMap — real interactive map with Google Maps tiles
// ---------------------------------------------------------------------------

function LeafletMap({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [selectedCity, setSelectedCity] = useState<{
    artists: Artist[];
    city: string;
    country: string;
  } | null>(null);

  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;

    let cancelled = false;

    import('leaflet').then((L) => {
      if (cancelled || !mapEl.current || mapRef.current) return;

      const map = L.map(mapEl.current, {
        center,
        zoom,
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        dragging: true,
        touchZoom: true,
        minZoom: 3,
        maxZoom: 18,
        worldCopyJump: true,
      });

      L.tileLayer(
        'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
        {
          attribution: '&copy; Google',
          subdomains: '0123',
          maxZoom: 20,
        },
      ).addTo(map);

      L.control.zoom({ position: 'topleft' }).addTo(map);

      // Build a lookup of cities that have artist data
      const artistLookup = new Map<string, Artist[]>();
      ROADTRIP_DATA.forEach((rc) => {
        if (rc.artists.length > 0) {
          artistLookup.set(rc.city, rc.artists);
        }
      });

      // Add a marker for each city at its exact GPS coordinates
      MAP_CITIES.forEach((city) => {
        const icon = L.divIcon({
          className: 'nomadtunes-marker',
          html: `<div class="nm-marker">
                   <div class="nm-pulse"></div>
                   <div class="nm-dot"></div>
                 </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([city.latitude, city.longitude], {
          icon,
          keyboard: false,
        }).addTo(map);

        marker.bindTooltip(
          `<div class="nm-tooltip"><strong>${city.city}</strong><br/>${city.country}</div>`,
          {
            direction: 'top',
            offset: [0, -10],
            opacity: 1,
            className: 'nomadtunes-tooltip',
          },
        );

        const artists = artistLookup.get(city.city);
        if (artists) {
          marker.on('click', () => {
            setSelectedCity({ artists, city: city.city, country: city.country });
          });
        }
      });

      mapRef.current = map;
    });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep map size in sync
  useEffect(() => {
    if (mapRef.current) {
      const id = setTimeout(() => mapRef.current.invalidateSize(), 100);
      return () => clearTimeout(id);
    }
  });

  return (
    <>
      <div ref={mapEl} className="absolute inset-0" style={{ background: '#ddd' }} />
      {selectedCity && (
        <ArtistPopup
          key={selectedCity.city}
          artists={selectedCity.artists}
          city={selectedCity.city}
          country={selectedCity.country}
          onClose={() => setSelectedCity(null)}
        />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// SpotifyEmbed — renders the official Spotify iframe via dangerouslySetInnerHTML
// ---------------------------------------------------------------------------

function SpotifyEmbed({ src }: { src: string }) {
  const html = `<iframe
style="border-radius:12px"
src="${src}"
width="100%"
height="352"
frameborder="0"
allowfullscreen=""
allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
loading="lazy"></iframe>`;

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

// ---------------------------------------------------------------------------
// ArtistPopup — premium minimalist popup for a city's artist
// ---------------------------------------------------------------------------

function ArtistPopup({
  artists,
  city,
  country,
  onClose,
}: {
  artists: Artist[];
  city: string;
  country: string;
  onClose: () => void;
}) {
  const [artistIndex, setArtistIndex] = useState(0);
  const artist = artists[artistIndex];
  const hasSeveralArtists = artists.length > 1;

  const showPreviousArtist = () => {
    setArtistIndex((index) => (index - 1 + artists.length) % artists.length);
  };

  const showNextArtist = () => {
    setArtistIndex((index) => (index + 1) % artists.length);
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div
        className="relative z-10 w-full max-w-[340px] animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass glass-orange rounded-2xl overflow-hidden shadow-2xl glow-orange-sm">
          {/* Close button */}
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full glass flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Fermer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Info */}
          <div className="p-4 pt-3 space-y-3">
            <div className="space-y-0.5">
              <h3 className="text-xl font-bold text-white tracking-tight">
                {artist.name}
              </h3>
              <p className="text-xs text-white/60">
                {city}, {country}
              </p>
            </div>

            {hasSeveralArtists && (
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-1">
                <button
                  type="button"
                  onClick={showPreviousArtist}
                  className="rounded-lg px-3 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Artiste précédent"
                >
                  ←
                </button>
                <span className="text-xs text-white/55">
                  {artistIndex + 1} / {artists.length}
                </span>
                <button
                  type="button"
                  onClick={showNextArtist}
                  className="rounded-lg px-3 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Artiste suivant"
                >
                  →
                </button>
              </div>
            )}

            {/* Spotify embed — official Spotify iframe via dangerouslySetInnerHTML */}
            {artist.spotifyEmbed && (
              <SpotifyEmbed src={artist.spotifyEmbed} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
