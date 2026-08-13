'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

type Location = {
  city: string;
  country: string;
};

function locationErrorMessage(error: unknown) {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    switch ((error as GeolocationPositionError).code) {
      case 1:
        return "L'accès à votre position est refusé. Autorisez Safari à utiliser votre position, puis réessayez.";
      case 2:
        return "Votre position est indisponible. Vérifiez que le Service de localisation est activé sur l'iPhone.";
      case 3:
        return "La recherche de votre position a expiré. Réessayez dans quelques secondes.";
    }
  }

  return error instanceof Error ? error.message : 'Échec de la mise à jour.';
}

export default function AdminLocationPage() {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [adminCode, setAdminCode] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadLocation() {
      const { data, error } = await supabase
        .from('site_location')
        .select('city,country')
        .limit(1)
        .maybeSingle();

      if (!mounted) return;
      if (error) {
        setMessage('Impossible de charger la localisation actuelle.');
      } else if (data) {
        setLocation(data as Location);
      }
      setLoading(false);
    }

    loadLocation();
    return () => {
      mounted = false;
    };
  }, []);

  const handleUpdateLocation = async () => {
    if (!adminCode) {
      setMessage('Saisissez le code administrateur.');
      return;
    }

    if (!navigator.geolocation) {
      setMessage('La géolocalisation n’est pas disponible dans ce navigateur.');
      return;
    }

    setUpdating(true);
    setMessage('');

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const response = await fetch('/api/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          secret: adminCode,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Impossible de mettre à jour la localisation.');
      }

      setLocation({ city: result.city, country: result.country });
      setMessage('Localisation mise à jour.');
      try {
        window.dispatchEvent(new Event('site_location_updated'));
      } catch {}
    } catch (error) {
      setMessage(locationErrorMessage(error));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="mb-6 text-3xl font-bold text-white">Localisation actuelle</h1>

      <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-white/80">
        {loading ? (
          <p>Chargement...</p>
        ) : location ? (
          <p className="text-lg">📍 {location.city}, {location.country}</p>
        ) : (
          <p>Aucune localisation configurée.</p>
        )}
      </div>

      <label className="mb-4 block text-sm text-white/80">
        Code administrateur
        <input
          type="password"
          value={adminCode}
          onChange={(event) => setAdminCode(event.target.value)}
          className="mt-2 block w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-white"
          autoComplete="current-password"
        />
      </label>

      <Button onClick={handleUpdateLocation} disabled={updating}>
        📍 Utiliser ma position actuelle
      </Button>

      {message ? <p className="mt-4 text-sm text-white/60">{message}</p> : null}
    </div>
  );
}
