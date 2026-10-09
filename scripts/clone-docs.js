import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';

import { VITEPRESS_VERSIONS_CONFIG } from './config/version.js';
import { parseNamedArgs } from './utils/common.js';
import { gitCloneAndCheckout, getGitUrlInfo } from './utils/git.js';
import { copyDirectorySync, copyFileSync } from './utils/file.js';
import { createLastmodCollector } from './utils/lastmod.js';

// ============================================ 脚本执行逻辑 ============================================
const ARGS = parseNamedArgs(); // 具名参数
const REPO = ARGS.repo || 'https://gitcode.com/opengauss/docs.git'; // 文档远程仓库地址
const BRANCH = ARGS.branch || ''; // 文档分支
const BUILD_PATH = ARGS.build || path.resolve().replace(/\\/g, '/');
const CACHE_PATH = ARGS.cache || path.join(BUILD_PATH, '.cache').replace(/\\/g, '/'); // 缓存路径

const branches = BRANCH.split(',');
if (!branches.length) {
  console.error('请指定分支（多个分支用英文逗号,分隔） --branch=<branch1,branch2,...>');
  process.exit(1);
}

const lastmodCollector = createLastmodCollector(BUILD_PATH);
syncDsl();
for (const branch of branches) {
  const version = VITEPRESS_VERSIONS_CONFIG[branch];
  lastmodCollector.clearVersion(version);
  if (version !== 'common') {
    lastmodCollector.clearVersion(`${version}-lite`);
  }
  syncDocs(branch, lastmodCollector);
  syncSigDocs(branch, lastmodCollector);
  lastmodCollector.save();
}

// ============================================ 同步文档函数 =============================================
/**
 * 同步 dsl 内容
 */
function syncDsl() {
  gitCloneAndCheckout(REPO, 'common', CACHE_PATH);
  copyDirectorySync(`${CACHE_PATH}/docs/dsl`, `${BUILD_PATH}/app/.vitepress/public/dsl/`, true);
}

/**
 * 同步文档内容到对应的目录
 * @param {string} branch - 分支
 */
function syncDocs(branch, collector) {
  const version = VITEPRESS_VERSIONS_CONFIG[branch];
  gitCloneAndCheckout(REPO, branch, CACHE_PATH);
  const zhSourcePath = path.join(CACHE_PATH, `docs/docs/zh/`);
  const zhTargetPath = path.join(BUILD_PATH, `app/zh/docs/${version}/`);
  const enSourcePath = path.join(CACHE_PATH, `docs/docs/en/`);
  const enTargetPath = path.join(BUILD_PATH, `app/en/docs/${version}/`);
  const repoDir = path.join(CACHE_PATH, `docs`);

  copyDirectorySync(zhSourcePath, zhTargetPath, true);
  copyDirectorySync(enSourcePath, enTargetPath, true);
  collector?.recordDirectory({ repoDir, sourceDir: zhSourcePath, targetDir: zhTargetPath });
  collector?.recordDirectory({ repoDir, sourceDir: enSourcePath, targetDir: enTargetPath });

  if (version !== 'common') {
    const zhLiteSourcePath = path.join(CACHE_PATH, `docs/docs-lite/zh/`);
    const zhLiteTargetPath = path.join(BUILD_PATH, `app/zh/docs/${version}-lite/`);
    const enLiteSourcePath = path.join(CACHE_PATH, `docs/docs-lite/en/`);
    const enLiteTargetPath = path.join(BUILD_PATH, `app/en/docs/${version}-lite/`);

    copyDirectorySync(zhLiteSourcePath, zhLiteTargetPath, true);
    copyDirectorySync(enLiteSourcePath, enLiteTargetPath, true);
    collector?.recordDirectory({ repoDir, sourceDir: zhLiteSourcePath, targetDir: zhLiteTargetPath });
    collector?.recordDirectory({ repoDir, sourceDir: enLiteSourcePath, targetDir: enLiteTargetPath });
  }
}

/**
 * 同步 sig 文档内容到对应的目录
 * @param {string} branch 分支名
 */
function syncSigDocs(branch, collector) {
  const handledPath = {};

  const scanYaml = (obj, currentDir) => {
    if (typeof obj?.href?.upstream === 'string') {
      const { url, repo, branch, locations } = getGitUrlInfo(obj.href.upstream);
      console.log(`[syncSigDocs]: 检测到远程地址 - ${obj.href.upstream}`);
      const sourcePath = path.join(CACHE_PATH, repo, ...locations.slice(0, -1));
      const destPath = typeof obj.href.path === 'string' ? path.join(currentDir, obj.href.path) : path.join(currentDir, repo, ...locations.slice(2, -1));
      const repoDir = path.join(CACHE_PATH, repo);
      gitCloneAndCheckout(url, branch, CACHE_PATH);
      copyDirectorySync(sourcePath, destPath);
      collector?.recordDirectory({ repoDir, sourceDir: sourcePath, targetDir: destPath });

      if (!handledPath[sourcePath]) {
        handledPath[sourcePath] = true;
        scanDir(sourcePath);
      } else {
        console.log(`[syncSigDocs]: ${destPath} 已处理过`);
      }
    }

    if (typeof obj?.href === 'string' && /https?:\/\/(?:gitcode|atomgit|gitee)\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+\.md)/.test(obj.href)) {
      const { url, repo, branch, locations } = getGitUrlInfo(obj.href);
      console.log(`[syncSigDocs]: 检测到远程 md 地址 - ${obj.href}`);
      gitCloneAndCheckout(url, branch, CACHE_PATH);

      const repoDir = path.join(CACHE_PATH, repo);

      // 复制 md
      const sourceMd = path.join(CACHE_PATH, repo, ...locations);
      const destMd = path.join(currentDir, locations[locations.length - 1]);
      copyFileSync(sourceMd, destMd);
      collector?.recordFile({ repoDir, sourceFile: sourceMd, targetFile: destMd });

      // 复制 md 可能关联的资源目录
      const sourceDir = path.join(CACHE_PATH, repo, ...locations.slice(0, -1));
      for (const item of fs.readdirSync(sourceDir)) {
        const completeDir = path.join(sourceDir, item);
        if (fs.statSync(completeDir).isDirectory()) {
          const destDir = path.join(currentDir, item);
          copyDirectorySync(completeDir, destDir);
        }
      }
    }

    if (Array.isArray(obj.sections)) {
      obj.sections.forEach((item) => {
        scanYaml(item, currentDir);
      });
    }

    if (Array.isArray(obj.single_manuals)) {
      obj.single_manuals.forEach((item) => {
        scanYaml(item, currentDir);
      });
    }
  };

  const scanDir = (targetPath) => {
    if (!fs.existsSync(targetPath)) {
      console.log(`${targetPath} 不存在`);
      return;
    }

    for (const item of fs.readdirSync(targetPath)) {
      const completePath = path.join(targetPath, item);
      if (fs.statSync(completePath).isDirectory()) {
        scanDir(completePath);
      } else if (item.endsWith('_toc.yaml')) {
        try {
          const obj = yaml.load(fs.readFileSync(completePath, 'utf-8'));
          scanYaml(obj, targetPath);
        } catch (error) {
          console.error(`[syncSigDocs]: ${completePath} 解析失败`);
        }
      }
    }
  };

  const version = VITEPRESS_VERSIONS_CONFIG[branch];
  scanDir(`${BUILD_PATH}/app/zh/docs/${version}`);
  scanDir(`${BUILD_PATH}/app/en/docs/${version}`);
  if (version !== 'common') {
    scanDir(`${BUILD_PATH}/app/zh/docs/${version}-lite`);
    scanDir(`${BUILD_PATH}/app/en/docs/${version}-lite`);
  }
}
