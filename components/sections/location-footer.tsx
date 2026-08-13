'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function LocationFooter({ label }: { label: string }) {
  const [location, setLocation] = useState<{ city: string; country: string } | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadLocation() {
      const { data, error } = await supabase
        .from('site_location')
        .select('city,country')
        .limit(1)
        .maybeSingle();

      if (!mounted) return;
      if (!error && data) {
        setLocation(data as { city: string; country: string });
      }
    }

    loadLocation();

    const onSiteLocationUpdated = () => {
      loadLocation();
    };

    window.addEventListener('site_location_updated', onSiteLocationUpdated);

    return () => {
      mounted = false;
      window.removeEventListener('site_location_updated', onSiteLocationUpdated);
    };
  }, []);

  if (!location) {
    return null;
  }

  return (
    <>
      <p className="mt-2 text-sm text-white/40">📍 {label}</p>
      <p className="mt-1 text-sm text-white/40">{location.city}, {location.country}</p>
    </>
  );
}
