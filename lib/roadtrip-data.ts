export type Artist = {
  name: string;
  spotify: string;
  spotifyCover: string;
  spotifyEmbed?: string;
  instagram: string;
  youtube: string;
  songs: string[];
  description: string;
};

export type RoadtripCity = {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  artists: Artist[];
};

export const ROADTRIP_DATA: RoadtripCity[] = [
  {
    city: 'Miramas',
    country: 'France',
    latitude: 43.58,
    longitude: 4.9999,
    artists: [
      {
        name: 'Manet.C',
        spotify: 'https://open.spotify.com/track/381U42QNEA1T3zRFJ61t6v',
        spotifyCover:
          'https://mosaic.scdn.co/640/ab67616d0000b2730bc038d59c8d6a6014f1f0e0',
        spotifyEmbed:
          'https://open.spotify.com/embed/track/381U42QNEA1T3zRFJ61t6v?utm_source=generator&theme=0',
        instagram: '',
        youtube: '',
        songs: [],
        description: '',
      },
    ],
  },
];

export type MapCity = {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
};

export const MAP_CITIES: MapCity[] = [
  // France
  { city: 'Marseille', country: 'France', latitude: 43.2965, longitude: 5.3698 },
  { city: 'Salon-de-Provence', country: 'France', latitude: 43.6396, longitude: 5.0952 },
  { city: 'Miramas', country: 'France', latitude: 43.58, longitude: 4.9999 },
  { city: 'Cavaillon', country: 'France', latitude: 43.8417, longitude: 5.0458 },
  { city: 'Fuveau', country: 'France', latitude: 43.4508, longitude: 5.5667 },
  { city: 'Bouc-Bel-Air', country: 'France', latitude: 43.4231, longitude: 5.3747 },
  { city: 'La Fare-les-Oliviers', country: 'France', latitude: 43.5556, longitude: 5.1742 },
  { city: 'Miribel', country: 'France', latitude: 45.8253, longitude: 4.9536 },
  { city: 'La Javie', country: 'France', latitude: 44.4717, longitude: 6.2367 },
  { city: 'Marly', country: 'France', latitude: 49.0833, longitude: 6.1833 },
  { city: 'Metz', country: 'France', latitude: 49.1193, longitude: 6.1764 },
  // Pays-Bas
  { city: 'Rotterdam', country: 'Pays-Bas', latitude: 51.9244, longitude: 4.4777 },
  { city: 'La Haye', country: 'Pays-Bas', latitude: 52.0705, longitude: 4.3007 },
  { city: 'Groningen', country: 'Pays-Bas', latitude: 53.2194, longitude: 6.5665 },
  { city: 'Apeldoorn', country: 'Pays-Bas', latitude: 52.2112, longitude: 5.9569 },
  { city: 'Heerlen', country: 'Pays-Bas', latitude: 50.8882, longitude: 5.9815 },
  { city: 'Kampen', country: 'Pays-Bas', latitude: 52.5578, longitude: 5.9094 },
  // Allemagne
  { city: 'Hambourg', country: 'Allemagne', latitude: 53.5511, longitude: 9.9937 },
  { city: 'Bochum', country: 'Allemagne', latitude: 51.4818, longitude: 7.2165 },
  // Belgique
  // République tchèque
  { city: 'Plzeň', country: 'République tchèque', latitude: 49.7384, longitude: 13.3736 },
  // Danemark
  { city: 'Haderslev', country: 'Danemark', latitude: 55.2538, longitude: 9.4879 },
  { city: 'Rødding', country: 'Danemark', latitude: 55.2413, longitude: 9.0573 },
  { city: 'Randers', country: 'Danemark', latitude: 56.4614, longitude: 10.0579 },
  // Estonie
  { city: 'Tartu', country: 'Estonie', latitude: 58.378, longitude: 26.729 },
  // Espagne
  { city: 'Sabadell', country: 'Espagne', latitude: 41.5433, longitude: 2.1085 },
];

export const ROADTRIP_STATS = {
  countries: new Set(ROADTRIP_DATA.map((c) => c.country)).size,
  cities: ROADTRIP_DATA.length,
  artists: ROADTRIP_DATA.reduce((sum, c) => sum + c.artists.length, 0),
  songs: ROADTRIP_DATA.reduce(
    (sum, c) => sum + c.artists.reduce((s, a) => s + a.songs.length, 0),
    0,
  ),
};
