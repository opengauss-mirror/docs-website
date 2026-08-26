import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

import { ensureDirSync, removeSync } from './file.js';

const GIT_REFNAME_FORBIDDEN = /[\s~^:?*\[\\]|\.\.|@{|\/\.\/|\/$|^\-|^\.|^\.\.$/;

function assertValidGitUrl(url) {
  if (typeof url !== 'string' || url.length === 0) {
    throw new Error(`[git] 非法的仓库地址: ${url}`);
  }
  const parsed = new URL(url);
  if (!/^https?:$|^git$|^ssh$|^git\+ssh:$/.test(parsed.protocol)) {
    throw new Error(`[git] 不支持的协议: ${parsed.protocol} (仅允许 http/https/git/ssh)`);
  }
  if (/[\s\r\n]/.test(url)) {
    throw new Error(`[git] 仓库地址包含空白/控制字符: ${url}`);
  }
}

function assertValidGitBranch(branch) {
  if (typeof branch !== 'string' || branch.length === 0) {
    throw new Error(`[git] 非法的分支名: ${branch}`);
  }
  if (branch.startsWith('-') || GIT_REFNAME_FORBIDDEN.test(branch)) {
    throw new Error(`[git] 非法的分支名(包含禁用字符或以 - 开头): ${branch}`);
  }
}

function git(args, options) {
  return execFileSync('git', args, { stdio: 'pipe', encoding: 'utf-8', ...options });
}

function gitInherit(args, options) {
  execFileSync('git', args, { stdio: 'inherit', ...options });
}

/**
 * 解析 Git 仓库 URL，提取仓库信息
 * @param {string} gitUrl - 完整的 Git 仓库 URL 地址
 * @returns {object} 包含URL解析信息的对象
 */
export function getGitUrlInfo(gitUrl) {
  const url = new URL(gitUrl);
  const [owner, repo, __, branch, ...locations] = url.pathname.replace('/', '').split('/');

  return {
    url: `${url.origin}/${owner}/${repo}`,
    owner,
    repo,
    branch,
    locations,
  }
}

/**
 * 检查指定路径是否为 Git 仓库
 * @param {string} targetPath - 要检查的目标路径
 * @returns {boolean} 如果目标路径是 Git 仓库则返回 true，否则返回 false
 */
export function isGitRepo(targetPath) {
  return fs.existsSync(path.join(targetPath, '.git/config'));
}

/**
 * 拉取并切换分支
 * @param {string} url 远程仓库地址
 * @param {string} branch 分支名
 * @param {string} storagePath 存放目录
 */
export function gitCloneAndCheckout(url, branch, storagePath) {
  assertValidGitUrl(url);
  assertValidGitBranch(branch);
  ensureDirSync(storagePath);
  const repo = url.split('/').slice().pop().replace('.git', '');
  const repoDir = path.join(storagePath, repo);

  // 拉取远程仓库
  if (!fs.existsSync(repoDir) || (fs.existsSync(repoDir) && !isGitRepo(repoDir))) {
    removeSync(repoDir);
    gitInherit(['clone', '--', url, repoDir]);
    console.log(`[gitCloneAndCheckout]：克隆 ${repo} 仓库成功! `);
  }

  // 切换目标分支
  gitInherit(['checkout', '-f', 'HEAD', '--', '.'], { cwd: repoDir });
  gitInherit(['clean', '-fd'], { cwd: repoDir });
  gitInherit(['pull'], { cwd: repoDir });
  const branchList = git(['branch', '--list', branch], { cwd: repoDir }).trim();
  if (!branchList) {
    console.log(`[gitCloneAndCheckout]：本地不存在分支 ${branch}，开始尝试拉取并切换远程分支`);
    gitInherit(['checkout', '-b', branch, '--track', `origin/${branch}`], { cwd: repoDir });
    console.log(`[gitCloneAndCheckout]：拉取并切换远程分支 ${branch} 成功`);
    return;
  }

  console.log(`[gitCloneAndCheckout]：本地存在分支 ${branch}，开始切换分支`);
  try {
    gitInherit(['checkout', '-f', branch], { cwd: repoDir });
    console.log(`[gitCloneAndCheckout]：切换分支成功，开始拉取远程更新内容`);
    gitInherit(['pull', 'origin', branch], { cwd: repoDir });
    console.log(`[gitCloneAndCheckout]：拉取远程内容成功`);
  } catch {
    console.log(`[gitCloneAndCheckout]：拉取远程内容成功，尝试强制拉取`);
    gitInherit(['reset', '--hard', `origin/${branch}`], { cwd: repoDir });
    console.log(`[gitCloneAndCheckout]：拉取远程分支 ${branch} 内容成功`);
  }
}

/**
 * 切换到指定的 Git 分支
 * @param {string} repoPath - Git 仓库的本地路径
 * @param {string} branch - 要切换到的分支名称
 */
export function checkoutBranch(repoPath, branch) {
  assertValidGitBranch(branch);
  console.log(`[checkoutBranch]：开始检出 ${branch} 分支`);
  gitInherit(['checkout', branch], { cwd: repoPath });

  console.log(`[checkoutBranch]：成功在 ${repoPath} 检出 ${branch} 分支`);
};

/**
 * 拉取远程分支的内容
 * @param {string} repoPath - Git 仓库的本地路径
 * @param {string} branch - 要拉取的远程分支名称
 */
export function pullRemoteBranch(repoPath, branch) {
  assertValidGitBranch(branch);
  console.log(`[pullRemoteBranch]：开始拉取 ${branch} 分支`);
  gitInherit(['pull', 'origin', branch], { cwd: repoPath });

  console.log(`[pullRemoteBranch]：成功拉取远程 ${branch} 分支`);
};