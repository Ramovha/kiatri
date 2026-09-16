import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

const ROUTES = [
  { path: '', priority: 1 },
  { path: '/products', priority: 0.9 },
  { path: '/pricing', priority: 0.9 },
  { path: '/business', priority: 0.8 },
  { path: '/small-business', priority: 0.8 },
  { path: '/numbers', priority: 0.6 },
  { path: '/security', priority: 0.6 },
  { path: '/faq', priority: 0.6 },
  { path: '/about', priority: 0.5 },
  { path: '/contact', priority: 0.5 },
  { path: '/legal/terms', priority: 0.2 },
  { path: '/legal/privacy', priority: 0.2 },
  { path: '/legal/sla', priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    priority,
  }));
}
