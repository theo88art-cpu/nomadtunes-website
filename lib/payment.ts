import Stripe from 'stripe';

export const MIX_MASTER_STORAGE_BUCKET = 'mix-master-files';

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error('Stripe is not configured.');
  }

  return new Stripe(secretKey);
}

export async function getPaidCheckoutSession(sessionId: string) {
  if (!sessionId.startsWith('cs_')) {
    throw new Error('Invalid payment session.');
  }

  const session = await getStripeClient().checkout.sessions.retrieve(sessionId);

  // A 100% promotion code creates a valid free Checkout session.
  if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') {
    throw new Error('Payment has not been confirmed yet.');
  }

  return session;
}

export function safeFileName(fileName: string) {
  const baseName = fileName.split(/[\\/]/).pop() || 'multipistes.zip';
  const cleaned = baseName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120);

  return cleaned || 'multipistes.zip';
}
