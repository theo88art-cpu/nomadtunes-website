'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Mail, Check, Loader2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/lib/supabase';
import { Reveal } from '@/components/reveal';

export function Newsletter() {
  const { t } = useLanguage();
  const tr = t.newsletter;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email });
    if (error) {
      if (error.code === '23505') {
        setStatus('success');
      } else {
        setStatus('error');
      }
      return;
    }

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
      await fetch(`${supabaseUrl}/functions/v1/newsletter-notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Email notification is best-effort; the subscription itself succeeded.
    }
    setStatus('success');
  };

  return (
    <section id="newsletter" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-[#ff6a00]/20 bg-gradient-to-br from-[#ff6a00]/10 via-[#0a0a0a] to-[#0a0a0a] p-8 text-center sm:p-14">
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#ff6a00]/20 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-[#ff6a00]/10 blur-[80px]" />

            <div className="relative">
              <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                {tr.title1} <span className="text-gradient-orange">{tr.titleHighlight}</span>{tr.title2}
              </h2>
              <p className="mx-auto mt-4 max-w-md text-white/55">
                {tr.description}
              </p>

              <div className="mx-auto mt-8 max-w-md">
                <AnimatePresence mode="wait">
                  {status === 'success' ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-center gap-3 rounded-full bg-[#ff6a00] py-4 glow-orange"
                    >
                      <Check className="h-5 w-5 text-white" />
                      <span className="font-semibold text-white">
                        {tr.success}
                      </span>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-3 sm:flex-row"
                    >
                      <div className="relative flex-1">
                        <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                        <input
                          type="email"
                          required
                          placeholder={tr.placeholder}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-full border border-white/10 bg-white/[0.05] py-4 pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:border-[#ff6a00]/50 focus:outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="flex items-center justify-center gap-2 rounded-full bg-[#ff6a00] px-7 py-4 text-sm font-semibold text-white transition-all hover:scale-105 hover:glow-orange-sm disabled:opacity-50"
                      >
                        {status === 'loading' ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            {tr.subscribe}
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
                {status === 'error' && (
                  <p className="mt-3 text-sm text-red-400">
                    {tr.error}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
