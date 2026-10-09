import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

type LastmodStore = Record<string, string>;

interface SitemapLikeItem {
  url: string;
  lastmod?: string | number | Date;
}

const moduleDir = dirname(fileURLToPath(import.meta.url));
const LASTMOD_SIDECAR_PATH = process.env.DOCS_LASTMOD_FILE || resolve(moduleDir, '../../../../.cache/docs-lastmod.json');

let lastmodLookupCache: Map<string, string> | null = null;

function loadLastmodLookup(): Map<string, string> {
  if (lastmodLookupCache) {
    return lastmodLookupCache;
  }

  const lookup = new Map<string, string>();
  lastmodLookupCache = lookup;

  if (!existsSync(LASTMOD_SIDECAR_PATH)) {
    console.log(`[sitemap] 未找到提交时间侧车文件（${LASTMOD_SIDECAR_PATH}），lastmod 回退为构建时间`);
    return lookup;
  }

  try {
    const content = JSON.parse(readFileSync(LASTMOD_SIDECAR_PATH, 'utf-8')) as LastmodStore;
    if (!content || typeof content !== 'object' || Array.isArray(content)) {
      console.log(`[sitemap] 提交时间侧车文件格式无效，lastmod 回退为构建时间：${LASTMOD_SIDECAR_PATH}`);
      return lookup;
    }

    for (const [key, value] of Object.entries(content)) {
      if (typeof value === 'string' && value) {
        lookup.set(key, value);
      }
    }

    console.log(`[sitemap] 已加载提交时间 ${lookup.size} 条（文件：${LASTMOD_SIDECAR_PATH}）`);
  } catch (err) {
    console.log(`[sitemap] 读取提交时间侧车文件失败，lastmod 回退为构建时间：${(err as Error).message}`);
  }

  return lookup;
}

function buildLastmodKeys(branch: string, locale: string, pagePath: string): string[] {
  if (!pagePath) {
    return [`${branch}::${locale}/index.md`];
  }

  const dirPath = pagePath.replace(/\/index$/, '');
  const keys = [`${branch}::${locale}/${pagePath}.md`];
  if (dirPath !== pagePath) {
    keys.push(`${branch}::${locale}/${dirPath}.md`, `${branch}::${locale}/${dirPath}/index.md`);
  } else {
    keys.push(`${branch}::${locale}/${dirPath}/index.md`);
  }

  return keys;
}

function getSitemapPathname(url: string): string {
  const isAbsoluteUrl = /^[a-z][a-z\d+\-.]*:\/\//i.test(url);
  const target = isAbsoluteUrl ? url : `http://localhost${url.startsWith('/') ? url : `/${url}`}`;

  try {
    return decodeURIComponent(new URL(target).pathname);
  } catch {
    return '';
  }
}

function resolveSitemapLastmod(url: string, lookup: Map<string, string>): string {
  if (lookup.size === 0) {
    return '';
  }

  const pathname = getSitemapPathname(url);
  if (!pathname) {
    return '';
  }

  const matched = /^\/(zh|en)\/docs\/([^/]+)\/(.*)$/.exec(pathname);
  if (!matched) {
    return '';
  }

  const [, locale, branch, rest] = matched;
  const pagePath = rest.replace(/\.html$/, '').replace(/\/$/, '');

  for (const key of buildLastmodKeys(branch, locale, pagePath)) {
    const value = lookup.get(key);
    if (value) {
      return value;
    }
  }

  return '';
}

export function applySitemapLastmod<T extends SitemapLikeItem>(items: T[]): T[] {
  const lookup = loadLastmodLookup();
  const buildTime = new Date().toISOString();

  for (const item of items) {
    item.lastmod = resolveSitemapLastmod(item.url, lookup) || buildTime;
  }

  return items;
}
