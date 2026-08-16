import { NextResponse } from 'next/server';

const BREVO_CONTACTS_URL = 'https://api.brevo.com/v3/contacts';

export async function POST(request: Request) {
  const { email, consent } = await request.json().catch(() => ({}));

  if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email) || consent !== true) {
    return NextResponse.json({ error: 'Informations invalides.' }, { status: 400 });
  }

  // Vercel values are sometimes pasted with quotes, whitespace or the
  // variable name itself. Normalize those harmless formatting mistakes
  // without ever logging the secret.
  const apiKey = process.env.BREVO_API_KEY
    ?.trim()
    .replace(/^BREVO_API_KEY\s*=\s*/, '')
    .replace(/^(["'])(.*)\1$/, '$2')
    .trim();
  const listIdValue = process.env.BREVO_NEWSLETTER_LIST_ID
    ?.trim()
    .replace(/^BREVO_NEWSLETTER_LIST_ID\s*=\s*/, '')
    .replace(/^(["'])(.*)\1$/, '$2')
    .trim();
  const listId = Number(listIdValue);

  if (!apiKey || !Number.isInteger(listId) || listId <= 0) {
    console.error('La newsletter Brevo n’est pas configurée.');
    return NextResponse.json({ error: 'Newsletter indisponible.' }, { status: 503 });
  }

  let response: Response;

  try {
    response = await fetch(BREVO_CONTACTS_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        listIds: [listId],
        updateEnabled: true,
      }),
    });
  } catch (error) {
    console.error(
      'Brevo newsletter network error:',
      error instanceof Error ? error.message : 'unknown error',
    );
    return NextResponse.json({ error: 'Impossible de contacter la newsletter.' }, { status: 502 });
  }

  if (!response.ok) {
    const details = await response.text().catch(() => '');
    console.error(
      'Brevo newsletter error:',
      response.status,
      details.slice(0, 300),
    );
    return NextResponse.json({ error: 'Impossible de t’inscrire pour le moment.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
