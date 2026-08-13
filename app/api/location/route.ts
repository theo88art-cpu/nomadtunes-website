import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // runtime presence check for SUPABASE_SERVICE_ROLE_KEY (do not log its value)
    try {
      console.log('SUPABASE_SERVICE_ROLE_KEY_RUNTIME:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'PRESENT' : 'MISSING');
    } catch (e) {}
    const body = await request.json();
    const { latitude, longitude, secret } = body;

    const adminSecret = process.env.ADMIN_LOCATION_SECRET;
    if (!adminSecret || secret !== adminSecret) {
      return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 401 });
    }

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json({ error: 'Latitude et longitude requises.' }, { status: 400 });
    }

    const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(
      latitude
    )}&lon=${encodeURIComponent(longitude)}&zoom=10&addressdetails=1`;
    let geocode = null;
    try {
      const geocodeRes = await fetch(geocodeUrl, {
        headers: {
          // Nominatim requires a valid User-Agent or Referer; keep this generic and non-secret
          'User-Agent': 'nomadtunes/1.0 (local)',
          'Accept-Language': 'fr'
        },
      });

      if (geocodeRes.ok) {
        try {
          geocode = await geocodeRes.json();
        } catch (e) {
          // If parsing fails, log the raw response body so we don't hide errors behind JSON.parse
          const raw = await geocodeRes.text().catch(() => '<no-body>');
          console.error('NOMINATIM_STATUS', geocodeRes.status, raw);
          console.error('Nominatim invalid JSON', e);
          geocode = null;
        }
      } else {
        // Log the status and raw body when Nominatim responds with non-OK
        const text = await geocodeRes.text().catch(() => '');
        console.error('NOMINATIM_STATUS', geocodeRes.status, text);
        geocode = null;
      }
    } catch (e) {
      console.error('Nominatim fetch failed', e);
      geocode = null;
    }

    const city = geocode?.address?.city || geocode?.address?.town || geocode?.address?.village || geocode?.address?.county || null;
    const country = geocode?.address?.country || null;

    const SINGLETON_ID = '00000000-0000-0000-0000-000000000000';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseServiceRoleKey) {
      console.error('SUPABASE_SERVICE_ROLE_KEY missing in server environment');
      return NextResponse.json({ error: 'Configuration manquante.' }, { status: 500 });
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

    const upsertPayload: Record<string, unknown> = {
      id: SINGLETON_ID,
      latitude,
      longitude,
      updated_at: new Date().toISOString(),
    };
    if (city) upsertPayload.city = city;
    if (country) upsertPayload.country = country;

    const { data, error } = await supabaseClient.from('site_location').upsert(upsertPayload, { onConflict: 'id' });

    if (error) {
      // Log structured Supabase error details for debugging (temporary)
      try {
        console.error('SUPABASE_ERROR.code', (error as any)?.code);
        console.error('SUPABASE_ERROR.message', (error as any)?.message);
      } catch (e) {
        console.error('Supabase error (unstructured)', error);
      }
      console.error('Supabase upsert error', error);
      return NextResponse.json({ error: 'Erreur interne.' }, { status: 500 });
    }

    return NextResponse.json({ city, country, updated_at: new Date().toISOString() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur interne.' }, { status: 500 });
  }
}
