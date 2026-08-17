import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/paiement/'],
    },
    sitemap: 'https://nomadtunes.com/sitemap.xml',
    host: 'https://nomadtunes.com',
  };
}
