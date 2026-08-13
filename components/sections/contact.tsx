'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  Mail,
  MapPin,
  Instagram,
  Music,
  Youtube,
  Send,
  Check,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { SITE } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { Reveal } from '@/components/reveal';

export function Contact() {
  const { t } = useLanguage();
  const tr = t.contact;
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const { error } = await supabase.from('contest_entries').insert({
      instagram: form.name,
      email: form.email,
      country: 'Contact',
      song_url: form.message,
      accepted_terms: true,
    });
    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
    }
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff6a00]/5 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ff6a00]">
            {tr.label}
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            {tr.title}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/55">
            {tr.description}
          </p>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Form */}
          <Reveal className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8"
            >
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ff6a00] glow-orange"
                    >
                      <Check className="h-8 w-8 text-white" />
                    </motion.div>
                    <h3 className="mt-5 font-display text-xl font-bold text-white">
                      {tr.successTitle}
                    </h3>
                    <p className="mt-2 text-sm text-white/50">
                      {tr.successDesc}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      <input
                        placeholder={tr.phName}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-[#ff6a00]/50 focus:outline-none"
                      />
                      <input
                        type="email"
                        placeholder={tr.phEmail}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-[#ff6a00]/50 focus:outline-none"
                      />
                    </div>
                    <textarea
                      placeholder={tr.phMessage}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      rows={5}
                      className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-[#ff6a00]/50 focus:outline-none"
                    />
                    {status === 'error' && (
                      <p className="text-sm text-red-400">
                        {tr.error}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#ff6a00] px-8 py-4 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:glow-orange disabled:opacity-50"
                    >
                      {status === 'loading' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          {tr.send}
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Reveal>

          {/* Info */}
          <Reveal delay={0.15} className="lg:col-span-2">
            <div className="flex h-full flex-col gap-4">
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-[#ff6a00]/30"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff6a00]/15">
                  <Mail className="h-5 w-5 text-[#ff6a00]" />
                </span>
                <div>
                  <div className="text-xs text-white/40">{tr.emailLabel}</div>
                  <div className="text-sm font-medium text-white">{SITE.email}</div>
                </div>
              </a>

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff6a00]/15">
                  <MapPin className="h-5 w-5 text-[#ff6a00]" />
                </span>
                <div>
                  <div className="text-xs text-white/40">{tr.currentlyIn}</div>
                  <div className="text-sm font-medium text-white">{tr.currentlyValue}</div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="mb-3 text-xs text-white/40">{tr.followJourney}</div>
                <div className="flex gap-3">
                  <SocialLink href={SITE.socials.instagram} icon={Instagram} label="Instagram" />
                  <SocialLink href={SITE.socials.spotify} icon={Music} label="Spotify" />
                  <SocialLink href={SITE.socials.youtube} icon={Youtube} label="YouTube" />
                  <SocialLink href={SITE.socials.tiktok} icon={MessageSquare} label="TikTok" />
                </div>
              </div>

              <div className="flex-1 overflow-hidden rounded-2xl border border-white/10">
                <iframe
                  title={tr.mapTitle}
                  src="https://www.openstreetmap.org/export/embed.html?bbox=24.6%2C59.35%2C24.8%2C59.5&layer=mapnik&marker=59.42%2C24.74"
                  className="h-full min-h-[180px] w-full grayscale invert-[0.9] contrast-[1.2]"
                  loading="lazy"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function SocialLink({
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
      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/60 transition-all hover:bg-[#ff6a00] hover:text-white"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}
