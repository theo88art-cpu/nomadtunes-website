import './globals.css';
import 'leaflet/dist/leaflet.css';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { LanguageProvider } from '@/context/LanguageContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nomadtunes.com'),
  title: {
    default: 'Nomadtunes | Nomad Recording Studio Across Europe',
    template: '%s | Nomadtunes',
  },
  description:
    'Nomadtunes is a professional recording studio travelling across Europe in a camper van. Recording, music production, remote mixing and mastering.',
  keywords: [
    'nomad recording studio',
    'camper van studio',
    'music production Europe',
    'mixing mastering',
    'remote mixing and mastering',
    "studio d'enregistrement nomade",
    'mixage mastering à distance',
    'Nomadtunes',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Nomadtunes | Nomad Recording Studio Across Europe',
    description:
      'A professional recording studio travelling across Europe in a camper van. Recording, production, remote mixing and mastering.',
    url: '/',
    siteName: 'Nomadtunes',
    locale: 'en_GB',
    alternateLocale: ['fr_FR'],
    type: 'website',
    images: [
      {
        url: '/images/CAMPING CAR SOLEIL COUCHANT.png',
        width: 1536,
        height: 1024,
        alt: 'Nomadtunes nomad recording studio travelling across Europe',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nomadtunes | Nomad Recording Studio Across Europe',
    description:
      'A professional recording studio travelling across Europe in a camper van.',
    images: ['/images/CAMPING CAR SOLEIL COUCHANT.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'music',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://nomadtunes.com/#organization',
      name: 'Nomadtunes',
      url: 'https://nomadtunes.com/',
      logo: 'https://nomadtunes.com/logo_optimized.png',
      image:
        'https://nomadtunes.com/images/CAMPING%20CAR%20SOLEIL%20COUCHANT.png',
      email: 'mailto:nomadtunesfr@gmail.com',
      description:
        'A professional nomad recording studio travelling across Europe in a camper van.',
      sameAs: [
        'https://www.instagram.com/nomadtunes/',
        'https://www.tiktok.com/@nomadtunesfr',
        'https://www.youtube.com/@nomadtunes9580',
        'https://open.spotify.com/artist/1q3YaUKqu47bZVpIFQKF21',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://nomadtunes.com/#website',
      url: 'https://nomadtunes.com/',
      name: 'Nomadtunes',
      publisher: {
        '@id': 'https://nomadtunes.com/#organization',
      },
      inLanguage: ['en', 'fr'],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
          }}
        />
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
