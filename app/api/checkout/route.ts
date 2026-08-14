import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

const MIX_MASTER_PRICE_IN_CENTS = 10000;

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 503 });
  }

  const stripe = new Stripe(secretKey);
  const fallbackOrigin = new URL(request.url).origin;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || fallbackOrigin).replace(/\/$/, '');

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: MIX_MASTER_PRICE_IN_CENTS,
            product_data: {
              name: 'Mix & Master à distance',
              description: 'Mixage et mastering complet · pistes illimitées · 2 retouches incluses',
            },
          },
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      success_url: `${siteUrl}/paiement/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/#services`,
      metadata: { service: 'remote_mix_master' },
    });

    if (!session.url) {
      throw new Error('Stripe did not return a checkout URL');
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Unable to create Stripe Checkout session', error);
    return NextResponse.json({ error: 'Unable to create checkout session.' }, { status: 500 });
  }
}
