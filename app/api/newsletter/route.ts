import { NextResponse } from 'next/server';

const BREVO_CONTACTS_URL = 'https://api.brevo.com/v3/contacts';

export async function POST(request: Request) {
  const { email, consent } = await request.json().catch(() => ({}));

  if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email) || consent !== true) {
    return NextResponse.json({ error: 'Informations invalides.' }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_NEWSLETTER_LIST_ID);

  if (!apiKey || !Number.isInteger(listId) || listId <= 0) {
    console.error('La newsletter Brevo n’est pas configurée.');
    return NextResponse.json({ error: 'Newsletter indisponible.' }, { status: 503 });
  }

  const response = await fetch(BREVO_CONTACTS_URL, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      listIds: [listId],
      updateEnabled: true,
    }),
  });

  if (!response.ok) {
    console.error('Brevo newsletter error:', response.status);
    return NextResponse.json({ error: 'Impossible de t’inscrire pour le moment.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
