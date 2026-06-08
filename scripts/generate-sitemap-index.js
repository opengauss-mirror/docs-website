import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { VITEPRESS_VERSIONS_CONFIG, HUGO_VERSIONS_CONFIG } from './config/version.js';

const packageConfig = JSON.parse(readFileSync(join(import.meta.dirname, '../package.json'), 'utf-8'));
if (!packageConfig.scripts.build.includes('common')) {
  process.exit(0);
}

const dist = join(import.meta.dirname, '../app/.vitepress/dist');
const otherVersionSitemaps = [];

await Promise.all(
  [...Object.values(VITEPRESS_VERSIONS_CONFIG), ...Object.values(HUGO_VERSIONS_CONFIG)]
    .filter((ver) => ver !== 'common')
    .map((ver) => `https://docs.opengauss.org/docs/${ver}/sitemap.xml`)
    .map(async (url) => {
      try {
        const res = await fetch(url);
        if (res.ok) {
          otherVersionSitemaps.push(url);
        }
      } catch (error) {
        console.log(`fetch ${url} failed: `, error);
      }
    })
);

const sitemapIndexContent = `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://docs.opengauss.org/sitemap.xml</loc>
  </sitemap>
  ${otherVersionSitemaps.map((sitemapLoc) => {
    return `
  <sitemap>
    <loc>${sitemapLoc}</loc>
  </sitemap>`;
  }).join('')}
</sitemapindex>
`;
writeFileSync(join(dist, 'sitemap_index.xml'), sitemapIndexContent);
