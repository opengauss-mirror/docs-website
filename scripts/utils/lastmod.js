/* global process */

import fs from 'fs';
import path from 'path';

import { ensureDirSync } from './file.js';
import { getDirectoryLastCommitMap, getFileLastCommitIso, isGitRepo } from './git.js';

const SITE_CONTEXT_RE = /^(.*\/app\/(zh|en)\/docs\/([^/]+))(?:\/|$)/;
const LASTMOD_FILE_NAME = 'docs-lastmod.json';

function normalizePath(targetPath) {
  return String(targetPath || '').replace(/\\/g, '/');
}

function makeRelativePath(from, to) {
  const relative = normalizePath(path.relative(from, to));
  if (!relative || relative === '.' || relative.startsWith('../') || path.isAbsolute(relative)) {
    return '';
  }
  return relative;
}

export function getSiteContext(targetPath) {
  if (!targetPath) {
    return null;
  }

  const normalized = normalizePath(path.resolve(targetPath));
  const matched = SITE_CONTEXT_RE.exec(normalized);
  if (!matched) {
    return null;
  }

  return {
    versionRoot: matched[1],
    locale: matched[2],
    version: matched[3],
  };
}

function listMdFiles(targetDir) {
  if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
    return [];
  }

  const result = [];
  const walk = (currentDir) => {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const completePath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === '.git') {
          continue;
        }
        walk(completePath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        result.push(completePath);
      }
    }
  };

  walk(targetDir);
  return result;
}

export function getLastmodFilePath(rootDir) {
  if (process.env.DOCS_LASTMOD_FILE) {
    return path.resolve(process.env.DOCS_LASTMOD_FILE);
  }

  return path.join(rootDir, '.cache', LASTMOD_FILE_NAME);
}

export function loadLastmodStore(filePath) {
  const store = Object.create(null);
  try {
    if (!fs.existsSync(filePath)) {
      return store;
    }

    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return store;
    }

    for (const [key, value] of Object.entries(parsed)) {
      if (Object.prototype.hasOwnProperty.call(parsed, key) && typeof value === 'string' && value) {
        store[key] = value;
      }
    }
  } catch (err) {
    console.warn(`[lastmod] 读取 sidecar 失败，将使用本次复制结果重建：${filePath} - ${err.message}`);
  }

  return store;
}

export function saveLastmodStore(filePath, store) {
  try {
    ensureDirSync(path.dirname(filePath));

    const sortedStore = {};
    for (const key of Object.keys(store).sort()) {
      sortedStore[key] = store[key];
    }

    const tmpPath = `${filePath}.tmp`;
    fs.writeFileSync(tmpPath, `${JSON.stringify(sortedStore, null, 2)}\n`, 'utf-8');

    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath, { force: true });
    }
    fs.renameSync(tmpPath, filePath);
  } catch (err) {
    console.warn(`[lastmod] 写入 sidecar 失败，sitemap 将回退为构建时间：${filePath} - ${err.message}`);
  }
}

export function clearVersionLastmod(store, version) {
  if (!store || !version) {
    return;
  }

  const prefix = `${version}::`;
  for (const key of Object.keys(store)) {
    if (key.startsWith(prefix)) {
      delete store[key];
    }
  }
}

export function recordMdDirectoryLastmod(store, options) {
  if (!store || !options?.repoDir || !options?.sourceDir || !options?.targetDir) {
    return 0;
  }

  try {
    const ctx = getSiteContext(options.targetDir);
    if (!ctx) {
      return 0;
    }

    const repoDir = path.resolve(options.repoDir);
    const sourceDir = path.resolve(options.sourceDir);
    const targetDir = path.resolve(options.targetDir);
    if (!isGitRepo(repoDir) || !fs.existsSync(sourceDir)) {
      return 0;
    }

    const repoPath = makeRelativePath(repoDir, sourceDir) || '.';
    const batchCommitTimes = getDirectoryLastCommitMap(repoDir, repoPath);
    let count = 0;

    for (const sourceFile of listMdFiles(sourceDir)) {
      const sourceRelative = makeRelativePath(sourceDir, sourceFile);
      const repoFile = makeRelativePath(repoDir, sourceFile);
      const sitePath = makeRelativePath(ctx.versionRoot, path.join(targetDir, sourceRelative || ''));
      if (!sourceRelative || !repoFile || !sitePath) {
        continue;
      }

      const lastmod = batchCommitTimes.get(repoFile) || getFileLastCommitIso(repoDir, repoFile);
      if (!lastmod) {
        continue;
      }

      store[`${ctx.version}::${ctx.locale}/${sitePath}`] = lastmod;
      count += 1;
    }

    return count;
  } catch (err) {
    console.warn(`[lastmod] 记录目录提交时间失败：${options?.sourceDir} -> ${options?.targetDir} - ${err.message}`);
    return 0;
  }
}

export function recordMdFileLastmod(store, options) {
  if (!store || !options?.repoDir || !options?.sourceFile || !options?.targetFile) {
    return false;
  }

  try {
    const ctx = getSiteContext(options.targetFile);
    if (!ctx) {
      return false;
    }

    const repoDir = path.resolve(options.repoDir);
    const sourceFile = path.resolve(options.sourceFile);
    const targetFile = path.resolve(options.targetFile);
    if (!isGitRepo(repoDir) || !fs.existsSync(sourceFile)) {
      return false;
    }

    const repoFile = makeRelativePath(repoDir, sourceFile);
    const sitePath = makeRelativePath(ctx.versionRoot, targetFile);
    if (!repoFile || !sitePath) {
      return false;
    }

    const lastmod = getFileLastCommitIso(repoDir, repoFile);
    if (!lastmod) {
      return false;
    }

    store[`${ctx.version}::${ctx.locale}/${sitePath}`] = lastmod;
    return true;
  } catch (err) {
    console.warn(`[lastmod] 记录文件提交时间失败：${options?.sourceFile} -> ${options?.targetFile} - ${err.message}`);
    return false;
  }
}

export function createLastmodCollector(rootDir) {
  const filePath = getLastmodFilePath(rootDir);
  const store = loadLastmodStore(filePath);

  return {
    filePath,
    store,
    clearVersion(version) {
      clearVersionLastmod(store, version);
    },
    recordDirectory(options) {
      return recordMdDirectoryLastmod(store, options);
    },
    recordFile(options) {
      return recordMdFileLastmod(store, options);
    },
    save() {
      saveLastmodStore(filePath, store);
      console.log(`[lastmod] 已写入 ${Object.keys(store).length} 条提交时间 -> ${filePath}`);
      return store;
    },
  };
}
