import Link from 'next/link';

export default function PaymentThankYouPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080706] px-5 text-white">
      <section className="w-full max-w-xl rounded-3xl border border-[#ff6a00]/30 bg-white/[0.03] p-8 text-center shadow-[0_0_80px_rgba(255,106,0,0.12)] sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ff6a00]">Nomadtunes</p>
        <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">Merci pour ta réservation.</h1>
        <p className="mt-5 leading-relaxed text-white/65">
          Ton paiement a été transmis à Stripe. Je te recontacte pour organiser l&apos;envoi de tes pistes et le démarrage du projet.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-xl bg-[#ff6a00] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#ff8127]"
        >
          Retour au site
        </Link>
      </section>
    </main>
  );
}
