import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const PUBLIC_DIR = path.resolve(ROOT, 'public');
const SITE_URL = process.env.SITE_URL ?? 'https://example.com';

const SECTION_IDS = ['hero', 'about', 'projects', 'skills', 'experience', 'education', 'testimonials', 'blog', 'contact'];

const sitemapEntries = SECTION_IDS.map((id) => ({
  loc: id === 'hero' ? SITE_URL : `${SITE_URL}/#${id}`,
}));

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries
  .map((entry) => `  <url><loc>${entry.loc}</loc></url>`)
  .join('\n')}\n</urlset>\n`;

const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;

await mkdir(PUBLIC_DIR, { recursive: true });
await writeFile(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
await writeFile(path.join(PUBLIC_DIR, 'robots.txt'), robotsTxt, 'utf8');

console.log('Generated sitemap.xml and robots.txt');
