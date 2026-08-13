'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { Gift, Upload, Instagram, Mail, Globe, Check, Loader2, Phone } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/lib/supabase';
import { Reveal } from '@/components/reveal';

const MAX_FILE_SIZE = 500 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['.zip', '.rar', '.7z'];

const initialForm = {
  instagram: '',
  email: '',
  phone: '',
  country: '',
  accepted: false,
};

function makeUniqueArchiveName(originalName: string) {
  const safeName = originalName
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-');

  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).slice(2, 10);
  const datePart = new Date().toISOString().replace(/[:.]/g, '-');

  return `${datePart}_${timestamp}_${randomPart}_${safeName}`;
}

export function Contest() {
  const { t } = useLanguage();
  const tr = t.contest;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const resetFormState = () => {
    setForm(initialForm);
    setSelectedFile(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setErrorMessage('');

    if (!file) {
      setSelectedFile(null);
      setFileName('');
      return;
    }

    const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setSelectedFile(null);
      setFileName('');
      event.target.value = '';
      setStatus('error');
      setErrorMessage('Only .zip, .rar, and .7z files are accepted.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setSelectedFile(null);
      setFileName('');
      event.target.value = '';
      setStatus('error');
      setErrorMessage('The file is too large. Maximum size is 500 MB.');
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setStatus('error');
      setErrorMessage('Please select a valid ZIP, RAR, or 7Z archive.');
      return;
    }

    if (!form.accepted || !form.phone.trim() || !form.instagram.trim() || !form.email.trim() || !form.country.trim()) {
      setStatus('error');
      setErrorMessage(tr.errorTerms);
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    const uniqueFileName = makeUniqueArchiveName(selectedFile.name);
    const filePath = `contest-uploads/${uniqueFileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('contest-uploads')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: selectedFile.type || 'application/octet-stream',
        });

      if (uploadError) {
        throw new Error(uploadError.message || 'Upload failed.');
      }

      const data = {
        instagram: form.instagram.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        country: form.country.trim(),
        file_name: uniqueFileName,
        file_path: filePath,
        file_size: selectedFile.size,
        created_at: new Date().toISOString(),
      };

      console.log('INSERT PAYLOAD', data);
      console.log('SUPABASE URL', process.env.NEXT_PUBLIC_SUPABASE_URL);

      const { data: insertedData, error: insertError } = await supabase.from('contest_entries').insert(data);

      console.log('INSERT PAYLOAD:', data);
      console.log('INSERT RESULT DATA:', insertedData);
      console.log('INSERT ERROR FULL:', insertError);
      console.log('INSERT ERROR MESSAGE:', insertError?.message);
      console.log('INSERT ERROR CODE:', insertError?.code);
      console.log('INSERT ERROR DETAILS:', insertError?.details);
      console.log('INSERT ERROR HINT:', insertError?.hint);
      console.log('INSERT ERROR JSON:', JSON.stringify(insertError, null, 2));

      if (insertError) {
        console.error('INSERT ERROR OBJECT:', insertError);
        console.error('CODE:', insertError.code);
        console.error('MESSAGE:', insertError.message);
        console.error('DETAILS:', insertError.details);
        console.error('HINT:', insertError.hint);
        alert(JSON.stringify(insertError, null, 2));
        await supabase.storage.from('contest-uploads').remove([filePath]);
        throw new Error('Database insertion failed. The uploaded file was removed.');
      }

      resetFormState();
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong while submitting your entry.'
      );
    }
  };

  return (
    <section id="contest" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff6a00]/8 blur-[120px]" />

      <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff8c2a] to-[#ff6a00] glow-orange"
          >
            <Gift className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            {tr.title1} <span className="text-gradient-orange">{tr.titleHighlight}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-white/55">
            {tr.description}
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8"
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-[#ff6a00] glow-orange"
                  >
                    <Check className="h-10 w-10 text-white" />
                  </motion.div>
                  <h3 className="mt-6 font-display text-2xl font-bold text-white">
                    {tr.successTitle}
                  </h3>
                  <p className="mt-2 text-white/55">
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
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/70">
                      {tr.uploadLabel}
                    </label>
                    <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/15 px-6 py-8 text-center transition-colors hover:border-[#ff6a00]/40 hover:bg-[#ff6a00]/5">
                      <Upload className="h-5 w-5 text-[#ff6a00]" />
                      <span className="text-sm text-white/60">
                        {fileName || tr.uploadPlaceholder}
                      </span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".zip,.rar,.7z,application/zip,application/x-rar-compressed,application/x-7z-compressed"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      icon={Instagram}
                      placeholder={tr.phInstagram}
                      value={form.instagram}
                      onChange={(v) => setForm({ ...form, instagram: v })}
                    />
                    <Field
                      icon={Mail}
                      type="email"
                      placeholder={tr.phEmail}
                      value={form.email}
                      onChange={(v) => setForm({ ...form, email: v })}
                    />
                  </div>

                  <Field
                    icon={Phone}
                    type="tel"
                    placeholder={tr.phPhone}
                    value={form.phone}
                    onChange={(v) => setForm({ ...form, phone: v })}
                  />

                  <Field
                    icon={Globe}
                    placeholder={tr.phCountry}
                    value={form.country}
                    onChange={(v) => setForm({ ...form, country: v })}
                  />

                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={form.accepted}
                      onChange={(e) => setForm({ ...form, accepted: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent accent-[#ff6a00]"
                    />
                    <span className="text-xs leading-relaxed text-white/50">
                      {tr.terms}
                    </span>
                  </label>

                  {status === 'error' && (
                    <p className="text-sm text-red-400">{errorMessage || tr.errorTerms}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#ff6a00] px-8 py-4 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:glow-orange disabled:opacity-50"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {tr.submitting}
                      </>
                    ) : (
                      tr.submit
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  onChange,
}: {
  icon: typeof Mail;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:border-[#ff6a00]/50 focus:outline-none focus:ring-1 focus:ring-[#ff6a00]/30"
      />
    </div>
  );
}
