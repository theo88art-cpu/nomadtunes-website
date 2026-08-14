import { NextResponse } from 'next/server';
import { MIX_MASTER_STORAGE_BUCKET, getPaidCheckoutSession, safeFileName } from '@/lib/payment';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

type UploadRequest = {
  sessionId?: string;
  fileName?: string;
  contentType?: string;
  projectNote?: string;
};

async function ensurePrivateBucket() {
  const { error } = await supabaseAdmin.storage.createBucket(MIX_MASTER_STORAGE_BUCKET, {
    public: false,
  });

  // The bucket already existing is expected after the first order.
  if (error && !/already exists|duplicate/i.test(error.message)) {
    throw error;
  }
}

export async function POST(request: Request) {
  let body: UploadRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (!body.sessionId || !body.fileName) {
    return NextResponse.json({ error: 'Missing upload details.' }, { status: 400 });
  }

  try {
    const session = await getPaidCheckoutSession(body.sessionId);
    await ensurePrivateBucket();

    const orderFolder = `orders/${session.id}`;
    const filePath = `${orderFolder}/${Date.now()}-${safeFileName(body.fileName)}`;
    const note = {
      paymentSessionId: session.id,
      email: session.customer_details?.email ?? null,
      service: 'remote_mix_master',
      projectNote: body.projectNote?.trim().slice(0, 2000) || null,
      createdAt: new Date().toISOString(),
    };

    const { error: noteError } = await supabaseAdmin.storage
      .from(MIX_MASTER_STORAGE_BUCKET)
      .upload(`${orderFolder}/brief.json`, JSON.stringify(note, null, 2), {
        contentType: 'application/json',
        upsert: true,
      });

    if (noteError) {
      throw noteError;
    }

    const { data, error } = await supabaseAdmin.storage
      .from(MIX_MASTER_STORAGE_BUCKET)
      .createSignedUploadUrl(filePath);

    if (error || !data) {
      throw error || new Error('Unable to prepare secure upload.');
    }

    return NextResponse.json({
      bucket: MIX_MASTER_STORAGE_BUCKET,
      path: data.path,
      token: data.token,
    });
  } catch (error) {
    console.error('Unable to prepare mix master upload', error);
    return NextResponse.json(
      { error: 'Le paiement doit être confirmé avant l’envoi des fichiers.' },
      { status: 403 },
    );
  }
}
