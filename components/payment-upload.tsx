'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, FileArchive, Loader2, UploadCloud } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type UploadPreparation = {
  bucket: string;
  path: string;
  token: string;
};

type PaymentUploadProps = {
  sessionId?: string;
};

export function PaymentUpload({ sessionId }: PaymentUploadProps) {
  const [paymentState, setPaymentState] = useState<'checking' | 'paid' | 'unavailable'>('checking');
  const [file, setFile] = useState<File | null>(null);
  const [projectNote, setProjectNote] = useState('');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setPaymentState('unavailable');
      return;
    }

    fetch(`/api/payment-session?session_id=${encodeURIComponent(sessionId)}`, { cache: 'no-store' })
      .then((response) => setPaymentState(response.ok ? 'paid' : 'unavailable'))
      .catch(() => setPaymentState('unavailable'));
  }, [sessionId]);

  function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;
    setFile(nextFile);
    setError('');
    setStatus('idle');
  }

  async function uploadFiles(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!sessionId || !file) {
      setError('Choisis ton fichier ZIP de multipistes avant de continuer.');
      return;
    }

    setStatus('uploading');
    setError('');

    try {
      const preparationResponse = await fetch('/api/payment-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          fileName: file.name,
          contentType: file.type || 'application/zip',
          projectNote,
        }),
      });
      const preparation = (await preparationResponse.json()) as UploadPreparation & { error?: string };

      if (!preparationResponse.ok || !preparation.token) {
        throw new Error(preparation.error || 'Impossible de préparer l’envoi privé.');
      }

      const { error: uploadError } = await supabase.storage
        .from(preparation.bucket)
        .uploadToSignedUrl(preparation.path, preparation.token, file, {
          contentType: file.type || 'application/zip',
        });

      if (uploadError) {
        throw uploadError;
      }

      setStatus('done');
    } catch (uploadError) {
      console.error('Upload failed', uploadError);
      setStatus('error');
      setError('L’envoi n’a pas abouti. Vérifie ta connexion puis réessaie.');
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080706] px-5 py-10 text-white">
      <section className="w-full max-w-2xl rounded-3xl border border-[#ff6a00]/30 bg-white/[0.03] p-7 shadow-[0_0_80px_rgba(255,106,0,0.12)] sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ff6a00]">Nomadtunes</p>
        <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">Ton paiement est confirmé.</h1>

        {paymentState === 'checking' && (
          <p className="mt-6 flex items-center gap-3 text-white/70"><Loader2 className="size-5 animate-spin" /> Vérification du paiement…</p>
        )}

        {paymentState === 'unavailable' && (
          <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-400/10 p-5 text-white/75">
            <p className="font-semibold text-white">Paiement non confirmé.</p>
            <p className="mt-2 text-sm leading-relaxed">Si tu viens de payer, actualise cette page dans quelques secondes. Sinon, utilise le lien de retour de Stripe après le paiement.</p>
          </div>
        )}

        {paymentState === 'paid' && status !== 'done' && (
          <form className="mt-7 space-y-5" onSubmit={uploadFiles}>
            <p className="leading-relaxed text-white/65">Envoie ici un fichier ZIP contenant tes multipistes. Les fichiers sont stockés dans un espace privé, accessible uniquement à Nomadtunes.</p>
            <label className="block rounded-2xl border border-dashed border-white/25 bg-black/20 p-5 transition-colors hover:border-[#ff6a00]/60">
              <span className="flex items-center gap-3 font-semibold"><FileArchive className="size-5 text-[#ff6a00]" /> Fichier ZIP de multipistes</span>
              <input className="mt-4 block w-full text-sm text-white/70 file:mr-4 file:rounded-lg file:border-0 file:bg-[#ff6a00] file:px-4 file:py-2 file:font-bold file:text-white" type="file" accept=".zip,application/zip,application/x-zip-compressed" onChange={selectFile} required />
              {file && <span className="mt-3 block text-sm text-white/55">Sélectionné : {file.name}</span>}
            </label>
            <label className="block text-sm font-semibold text-white/85">
              Quelques mots sur ton projet <span className="font-normal text-white/40">(facultatif)</span>
              <textarea value={projectNote} onChange={(event) => setProjectNote(event.target.value)} maxLength={2000} rows={4} className="mt-2 w-full resize-y rounded-xl border border-white/15 bg-black/20 p-3 text-base font-normal text-white outline-none focus:border-[#ff6a00]" placeholder="Références, ambiance recherchée, éléments importants…" />
            </label>
            {error && <p className="text-sm text-red-300">{error}</p>}
            <button disabled={status === 'uploading'} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff6a00] px-5 py-3.5 font-bold text-white transition-colors hover:bg-[#ff8127] disabled:cursor-not-allowed disabled:opacity-60" type="submit">
              {status === 'uploading' ? <><Loader2 className="size-5 animate-spin" /> Envoi en cours…</> : <><UploadCloud className="size-5" /> Envoyer mes multipistes</>}
            </button>
          </form>
        )}

        {status === 'done' && (
          <div className="mt-7 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6">
            <CheckCircle2 className="size-8 text-emerald-300" />
            <h2 className="mt-3 text-xl font-bold">Fichiers bien reçus.</h2>
            <p className="mt-2 leading-relaxed text-white/70">Ton dossier est arrivé dans l’espace privé Nomadtunes. Je reviens vers toi pour le démarrage du mix &amp; master.</p>
          </div>
        )}

        <Link href="/" className="mt-8 inline-flex text-sm font-semibold text-white/70 transition-colors hover:text-white">← Retour au site</Link>
      </section>
    </main>
  );
}
