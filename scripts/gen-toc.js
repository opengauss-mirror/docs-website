import fs from 'fs-extra';
import path from 'path';
import url from 'url';
import { TocParser } from '@opendesign-plus/utils';

import { VITEPRESS_VERSIONS_CONFIG } from './config/version.js';

const { posix } = path;

// ============================================ 脚本执行逻辑 ============================================
const BUILD_PATH = path.join(path.dirname(url.fileURLToPath(import.meta.url)), '..').replace(/\\/g, '/');
const VERSIONS = process.argv.slice(2);

const globalErrors = [];
const globalHandledYaml = new Map();

const tocParser = new TocParser({
  buildPath: BUILD_PATH,
  docsRelativePath: 'app',
});

(async () => {
  const outputZhPath = posix.join(BUILD_PATH, './app/.vitepress/public/toc/toc.json');
  const outputEnPath = posix.join(BUILD_PATH, './app/.vitepress/public/toc/toc-en.json');
  const outputZhToc = [];
  const outputEnToc = [];

  for (const item of VERSIONS) {
    const version = VITEPRESS_VERSIONS_CONFIG[item] || item;
    const tocZh = buildVersionToc(version, 'zh');
    if (tocZh.length > 0) {
      outputZhToc.push(...tocZh);
    }

    const tocZhLite = buildVersionToc(`${version}-lite`, 'zh');
    if (tocZhLite.length > 0) {
      outputZhToc.push(...tocZhLite);
    }

    const tocEn = buildVersionToc(version, 'en');
    if (tocEn.length > 0) {
      outputEnToc.push(...tocEn);
    }

    const tocEnLite = buildVersionToc(`${version}-lite`, 'en');
    if (tocEnLite.length > 0) {
      outputEnToc.push(...tocEnLite);
    }
  }

  fs.outputFileSync(outputZhPath, JSON.stringify(outputZhToc));
  fs.outputFileSync(outputEnPath, JSON.stringify(outputEnToc));

  // 打印错误
  tocParser.formatLogErrors([...globalErrors, ...tocParser.getErrors()]);
  console.log(`构建 toc 结束`);
})();

// ============================================ 处理版本 toc 相关函数 ============================================
/**
 * 构建版本分支的 toc
 * @param {string} buildPath 构建目录
 * @param {string} version 版本
 */
function buildVersionToc(version, lang) {
  try {
    const toc = [];

    // 构建全量的
    const tocFilePath = posix.join(BUILD_PATH, `./app/${lang}/docs/${version}/_toc.yaml`);
    if (fs.existsSync(tocFilePath)) {
      const tocLang = tocParser.parse(tocFilePath);
      if (tocLang) {
        tocLang.id = `docs-${lang}-${version}`;
        tocLang.type = 'docs-version-root';
        toc.push(tocLang);
      }

      tocParser.clear();
    }

    // 扫描获取未加入全量 _toc.yaml 的指南
    const versionDir = posix.join(BUILD_PATH, `./app/${lang}/docs/${version}/`);
    if (fs.existsSync(versionDir)) {
      let singleManuals = [];
      if (Array.isArray(toc?.[0]?.single_manuals)) {
        toc[0].single_manuals.forEach((item) => {
          if (typeof item.href?.path === 'string') {
            item.href.path = posix.join(versionDir, item.href.path);
          }
        });

        singleManuals = toc[0].single_manuals;
      }

      for (const dirname of fs.readdirSync(versionDir)) {
        const tocPath = posix.join(versionDir, dirname, '_toc.yaml');
        if (!fs.existsSync(tocPath)) {
          continue;
        }

        if (globalHandledYaml.has(tocPath)) {
          continue;
        }

        const singleManualPath = posix.join(versionDir, dirname);
        const singleManualItem = singleManuals.find((item) => item.href?.path === singleManualPath);
        const singleToc = tocParser.parse(tocPath, singleManualItem?.href?.upstream);
        if (singleToc) {
          singleToc.id = `docs-${lang}-${version}-${dirname}`;
          singleToc.type = 'docs-single-manual-root';
          toc.push(singleToc);
        }

        tocParser.clear();
      }
    }

    return toc;
  } catch (err) {
    globalErrors.push({
      functionName: 'buildVersionToc',
      message: err.message,
      filePath: '',
      err,
    });
  }

  return [];
}
