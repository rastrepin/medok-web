import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MED OK DOVIRA — ведення вагітності',
    short_name: 'MED OK',
    description:
      'Кабінет пацієнтки МЦ MED OK. Деталі запису, анкета для лікаря, дорожня карта до клініки.',
    lang: 'uk',
    dir: 'ltr',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#1a7c75',
    categories: ['medical', 'health'],
    icons: [
      { src: '/icon-192.png',           sizes: '192x192', type: 'image/png', purpose: 'any'      },
      { src: '/icon-512.png',           sizes: '512x512', type: 'image/png', purpose: 'any'      },
      { src: '/icon-maskable-512.png',  sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/apple-icon.png',         sizes: '180x180', type: 'image/png', purpose: 'any'      },
    ],
  };
}
