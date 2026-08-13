'use client';

import { Instagram, Music2, Youtube, Heart } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { SITE } from '@/lib/data';
import { LocationFooter } from '@/components/sections/location-footer';
import { SpotifyIcon } from '@/components/icons/spotify-icon';

const LINK_KEYS = ['services', 'roadtrip', 'artists', 'portfolio', 'contest', 'faq', 'contact'] as const;

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative border-t border-white/10 py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <a href="#hero" className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo_optimized.png" alt={SITE.name} className="h-[75px] w-auto object-contain" />
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/40">
              {t.footer.description}
            </p>
            <div className="mt-5 flex gap-3">
              <Social href={SITE.socials.instagram} icon={Instagram} label="Instagram" />
              <Social href={SITE.socials.spotify} icon={SpotifyIcon} label="Spotify" />
              <Social href={SITE.socials.youtube} icon={Youtube} label="YouTube" />
              <Social href={SITE.socials.tiktok} icon={Music2} label="TikTok" />
            </div>
          </div>

          {/* Links */}
          <div className="md:justify-self-center">
            <div className="text-sm font-semibold text-white/60">{t.footer.explore}</div>
            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2.5">
              {LINK_KEYS.map((key) => (
                <a
                  key={key}
                  href={`#${key}`}
                  className="text-sm text-white/40 transition-colors hover:text-[#ff6a00]"
                >
                  {t.nav[key]}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="md:justify-self-end">
            <div className="text-sm font-semibold text-white/60">{t.footer.getInTouch}</div>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-4 block text-sm text-white/40 transition-colors hover:text-[#ff6a00]"
            >
              {SITE.email}
            </a>
            <LocationFooter label={t.footer.currentlyLabel} />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} {SITE.name}. {t.footer.rights}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-white/30">
            {t.footer.builtWith} <Heart className="h-3 w-3 fill-[#ff6a00] text-[#ff6a00]" /> {t.footer.builtWithSuffix}
          </p>
        </div>
      </div>
    </footer>
  );
}

function Social({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof Instagram;
  label: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white/50 transition-all hover:bg-[#ff6a00] hover:text-white"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}
