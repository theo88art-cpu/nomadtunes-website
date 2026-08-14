import { NextResponse } from 'next/server';
import { getPaidCheckoutSession } from '@/lib/payment';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing payment session.' }, { status: 400 });
  }

  try {
    await getPaidCheckoutSession(sessionId);
    return NextResponse.json({ paid: true });
  } catch (error) {
    console.error('Unable to verify Stripe payment', error);
    return NextResponse.json({ paid: false }, { status: 403 });
  }
}
