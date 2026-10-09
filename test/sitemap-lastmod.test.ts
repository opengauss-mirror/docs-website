/**
 * @vitest-environment node
 */
import fs from 'fs';
import os from 'node:os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const isoTime = '2026-01-02T03:04:05.000Z';

describe('sitemap-lastmod sidecar', () => {
  let tmpDir = '';
  let sidecarPath = '';

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gauss-sitemap-lastmod-'));
    sidecarPath = path.join(tmpDir, 'docs-lastmod.json');
    process.env.DOCS_LASTMOD_FILE = sidecarPath;
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    delete process.env.DOCS_LASTMOD_FILE;
    fs.rmSync(tmpDir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  async function loadModule() {
    vi.resetModules();
    return import('../app/.vitepress/src/utils/sitemap-lastmod');
  }

  it('sidecar 缺失时回退为构建时间', async () => {
    const { applySitemapLastmod } = await loadModule();
    const [item] = applySitemapLastmod([{ url: 'https://docs.opengauss.org/zh/docs/7.0.0/missing.html' }]);

    expect(item.lastmod).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it('按 locale、版本目录名和相对 URL 读取 sidecar', async () => {
    fs.writeFileSync(
      sidecarPath,
      JSON.stringify({
        '7.0.0::zh/中文/安装.md': isoTime,
      }),
      'utf-8'
    );

    const { applySitemapLastmod } = await loadModule();
    const [absoluteItem, relativeItem] = applySitemapLastmod([
      { url: 'https://docs.opengauss.org/zh/docs/7.0.0/%E4%B8%AD%E6%96%87/%E5%AE%89%E8%A3%85.html' },
      { url: '/zh/docs/7.0.0/%E4%B8%AD%E6%96%87/%E5%AE%89%E8%A3%85.html' },
    ]);

    expect(absoluteItem.lastmod).toBe(isoTime);
    expect(relativeItem.lastmod).toBe(isoTime);
  });

  it('lite 版本目录命中对应版本 key', async () => {
    fs.writeFileSync(
      sidecarPath,
      JSON.stringify({
        '7.0.0-lite::en/server/install.md': isoTime,
      }),
      'utf-8'
    );

    const { applySitemapLastmod } = await loadModule();
    const [item] = applySitemapLastmod([{ url: 'https://docs.opengauss.org/en/docs/7.0.0-lite/server/install.html' }]);

    expect(item.lastmod).toBe(isoTime);
  });

  it('目录 URL 回退查找 index.md', async () => {
    fs.writeFileSync(
      sidecarPath,
      JSON.stringify({
        'latest::zh/server/index.md': isoTime,
        'latest::en/server.md': isoTime,
      }),
      'utf-8'
    );

    const { applySitemapLastmod } = await loadModule();
    const [dirItem, indexHtmlItem, enItem] = applySitemapLastmod([
      { url: 'https://docs.opengauss.org/zh/docs/latest/server/' },
      { url: 'https://docs.opengauss.org/zh/docs/latest/server/index.html' },
      { url: 'https://docs.opengauss.org/en/docs/latest/server.html' },
    ]);

    expect(dirItem.lastmod).toBe(isoTime);
    expect(indexHtmlItem.lastmod).toBe(isoTime);
    expect(enItem.lastmod).toBe(isoTime);
  });

  it('版本根目录 URL 查找 locale 根 index.md', async () => {
    fs.writeFileSync(
      sidecarPath,
      JSON.stringify({
        'common::zh/index.md': isoTime,
      }),
      'utf-8'
    );

    const { applySitemapLastmod } = await loadModule();
    const [item] = applySitemapLastmod([{ url: 'https://docs.opengauss.org/zh/docs/common/' }]);

    expect(item.lastmod).toBe(isoTime);
  });
});
