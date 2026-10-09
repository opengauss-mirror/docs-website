// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';

vi.mock('child_process', () => ({
  execFileSync: vi.fn(),
}));

vi.mock('../scripts/utils/file.js', () => ({
  ensureDirSync: vi.fn(),
  removeSync: vi.fn(),
}));

import { execFileSync } from 'child_process';
import {
  getGitUrlInfo,
  isGitRepo,
  gitCloneAndCheckout,
  checkoutBranch,
  pullRemoteBranch,
  getFileLastCommitIso,
  getDirectoryLastCommitMap,
} from '../scripts/utils/git.js';
import { ensureDirSync, removeSync } from '../scripts/utils/file.js';

const exec = execFileSync as any;

function mockExec(options: { branchList?: string; pullThrows?: boolean } = {}) {
  const { branchList = '', pullThrows = false } = options;
  exec.mockImplementation((_cmd: any, args: any[]) => {
    if (args[0] === 'branch' && args[1] === '--list') return branchList;
    if (pullThrows && args[0] === 'pull' && args.length > 2) throw new Error('pull failed');
    return undefined;
  });
}

const REPO_URL = 'https://gitcode.com/opengauss/docs.git';

beforeEach(() => {
  vi.clearAllMocks();
  exec.mockReset();
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getGitUrlInfo', () => {
  it('解析标准 https 仓库地址（带 .git）', () => {
    const info = getGitUrlInfo('https://gitcode.com/opengauss/docs.git');
    expect(info.url).toBe('https://gitcode.com/opengauss/docs.git');
    expect(info.owner).toBe('opengauss');
    expect(info.repo).toBe('docs.git');
    expect(info.branch).toBeUndefined();
    expect(info.locations).toEqual([]);
  });

  it('解析带 blob/分支/文件路径的地址', () => {
    const info = getGitUrlInfo('https://gitcode.com/opengauss/docs/blob/master/zh/docs/intro.md');
    expect(info.url).toBe('https://gitcode.com/opengauss/docs');
    expect(info.owner).toBe('opengauss');
    expect(info.repo).toBe('docs');
    expect(info.branch).toBe('master');
    expect(info.locations).toEqual(['zh', 'docs', 'intro.md']);
  });

  it('解析不带 .git 后缀的地址', () => {
    const info = getGitUrlInfo('https://gitcode.com/opengauss/docs');
    expect(info.url).toBe('https://gitcode.com/opengauss/docs');
    expect(info.repo).toBe('docs');
    expect(info.locations).toEqual([]);
  });
});

describe('isGitRepo', () => {
  it('存在 .git/config 时返回 true', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    expect(isGitRepo('/fake/repo')).toBe(true);
  });

  it('不存在 .git/config 时返回 false', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    expect(isGitRepo('/fake/repo')).toBe(false);
  });
});

describe('gitCloneAndCheckout - 安全防护', () => {
  const maliciousUrls = [
    'https://gitcode.com/opengauss/docs.git; rm -rf ./fake-target',
    'https://gitcode.com/opengauss/docs.git && rm -rf ./fake-target',
    'https://gitcode.com/opengauss/docs.git`rm -rf ./fake-target`',
    'file:///etc/passwd',
    'javascript:alert(1)',
  ];

  it.each(maliciousUrls)('拦截恶意 URL: %s', (url) => {
    expect(() => gitCloneAndCheckout(url, 'master', '/cache')).toThrow();
    expect(exec).not.toHaveBeenCalled();
    expect(ensureDirSync).not.toHaveBeenCalled();
  });

  it('拦截非字符串 URL', () => {
    expect(() => gitCloneAndCheckout(undefined as any, 'master', '/cache')).toThrow();
    expect(exec).not.toHaveBeenCalled();
  });

  const maliciousBranches = [
    'master; rm -rf ./fake-target',
    'master && rm -rf ./fake-target',
    'master`rm -rf ./fake-target`',
    'master| rm -rf ./fake-target',
    '-upload-pack=evil',
    'master..other',
    'ma ster',
    '',
  ];

  it.each(maliciousBranches)('拦截恶意分支: %s', (branch) => {
    expect(() => gitCloneAndCheckout(REPO_URL, branch, '/cache')).toThrow();
    expect(exec).not.toHaveBeenCalled();
  });

  it('拦截非字符串分支', () => {
    expect(() => gitCloneAndCheckout(REPO_URL, undefined as any, '/cache')).toThrow();
    expect(exec).not.toHaveBeenCalled();
  });
});

describe('gitCloneAndCheckout - 调用契约', () => {
  it('使用 execFileSync 以数组参数调用 git（不经 shell）', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    mockExec({ branchList: '' });
    gitCloneAndCheckout(REPO_URL, 'master', '/cache');
    expect(exec).toHaveBeenCalled();
    expect(exec.mock.calls[0][0]).toBe('git');
    expect(Array.isArray(exec.mock.calls[0][1])).toBe(true);
  });

  it('clone 命令使用 -- 分隔符隔离 URL', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    mockExec({ branchList: '' });
    gitCloneAndCheckout(REPO_URL, 'master', '/cache');
    const cloneCall = exec.mock.calls.find((c: any[]) => c[1][0] === 'clone');
    expect(cloneCall).toBeTruthy();
    expect(cloneCall[1]).toEqual(['clone', '--', REPO_URL, expect.any(String)]);
  });

  it('checkout HEAD 使用 -- 分隔符', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    mockExec({ branchList: '' });
    gitCloneAndCheckout(REPO_URL, 'master', '/cache');
    expect(exec).toHaveBeenCalledWith('git', ['checkout', '-f', 'HEAD', '--', '.'], expect.any(Object));
  });
});

describe('gitCloneAndCheckout - 功能分支', () => {
  it('仓库不存在时执行 clone 并删除旧目录', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    mockExec({ branchList: '' });
    gitCloneAndCheckout(REPO_URL, 'dev', '/cache');
    const cloneCall = exec.mock.calls.find((c: any[]) => c[1][0] === 'clone');
    expect(cloneCall).toBeTruthy();
    expect(cloneCall[1]).toEqual(['clone', '--', REPO_URL, expect.any(String)]);
    expect(removeSync).toHaveBeenCalled();
    expect(ensureDirSync).toHaveBeenCalledWith('/cache');
  });

  it('仓库存在但非 git 仓库时先删除再 clone', () => {
    vi.spyOn(fs, 'existsSync').mockImplementation((p) => !String(p).includes('.git'));
    mockExec({ branchList: '' });
    gitCloneAndCheckout(REPO_URL, 'dev', '/cache');
    expect(removeSync).toHaveBeenCalled();
    expect(exec.mock.calls.find((c: any[]) => c[1][0] === 'clone')).toBeTruthy();
  });

  it('仓库存在且为 git 仓库时跳过 clone', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    mockExec({ branchList: '  dev' });
    gitCloneAndCheckout(REPO_URL, 'dev', '/cache');
    expect(removeSync).not.toHaveBeenCalled();
    expect(exec.mock.calls.find((c: any[]) => c[1][0] === 'clone')).toBeUndefined();
  });

  it('本地无分支时 checkout -b --track origin/<branch> 后返回', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    mockExec({ branchList: '' });
    gitCloneAndCheckout(REPO_URL, 'dev', '/cache');
    expect(exec).toHaveBeenCalledWith('git', ['checkout', '-b', 'dev', '--track', 'origin/dev'], expect.objectContaining({ stdio: 'inherit' }));
    expect(exec).not.toHaveBeenCalledWith('git', ['reset', '--hard', 'origin/dev'], expect.any(Object));
  });

  it('本地有分支且 pull 成功时 checkout -f 并 pull origin', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    mockExec({ branchList: '  dev', pullThrows: false });
    gitCloneAndCheckout(REPO_URL, 'dev', '/cache');
    expect(exec).toHaveBeenCalledWith('git', ['checkout', '-f', 'dev'], expect.objectContaining({ stdio: 'inherit' }));
    expect(exec).toHaveBeenCalledWith('git', ['pull', 'origin', 'dev'], expect.objectContaining({ stdio: 'inherit' }));
    expect(exec).not.toHaveBeenCalledWith('git', ['reset', '--hard', 'origin/dev'], expect.any(Object));
  });

  it('pull 失败时执行 reset --hard origin/<branch>', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    mockExec({ branchList: '  dev', pullThrows: true });
    gitCloneAndCheckout(REPO_URL, 'dev', '/cache');
    expect(exec).toHaveBeenCalledWith('git', ['reset', '--hard', 'origin/dev'], expect.objectContaining({ stdio: 'inherit' }));
  });

  it('执行 clean -fd 与 pull', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    mockExec({ branchList: '' });
    gitCloneAndCheckout(REPO_URL, 'dev', '/cache');
    expect(exec).toHaveBeenCalledWith('git', ['clean', '-fd'], expect.any(Object));
    expect(exec).toHaveBeenCalledWith('git', ['pull'], expect.objectContaining({ stdio: 'inherit' }));
  });
});

describe('checkoutBranch', () => {
  it('拦截恶意分支', () => {
    expect(() => checkoutBranch('/fake/repo', 'master; rm -rf ./fake-target')).toThrow();
    expect(exec).not.toHaveBeenCalled();
  });

  it('拦截空分支', () => {
    expect(() => checkoutBranch('/fake/repo', '')).toThrow();
    expect(exec).not.toHaveBeenCalled();
  });

  it('拦截非字符串分支', () => {
    expect(() => checkoutBranch('/fake/repo', undefined as any)).toThrow();
    expect(exec).not.toHaveBeenCalled();
  });

  it('正常调用 checkout <branch>', () => {
    checkoutBranch('/fake/repo', 'master');
    expect(exec).toHaveBeenCalledWith('git', ['checkout', 'master'], expect.objectContaining({ cwd: '/fake/repo', stdio: 'inherit' }));
  });
});

describe('pullRemoteBranch', () => {
  it('拦截恶意分支', () => {
    expect(() => pullRemoteBranch('/fake/repo', 'master && rm -rf ./fake-target')).toThrow();
    expect(exec).not.toHaveBeenCalled();
  });

  it('拦截空分支', () => {
    expect(() => pullRemoteBranch('/fake/repo', '')).toThrow();
    expect(exec).not.toHaveBeenCalled();
  });

  it('正常调用 pull origin <branch>', () => {
    pullRemoteBranch('/fake/repo', 'master');
    expect(exec).toHaveBeenCalledWith('git', ['pull', 'origin', 'master'], expect.objectContaining({ cwd: '/fake/repo', stdio: 'inherit' }));
  });
});

describe('getFileLastCommitIso', () => {
  it('返回单文件最后提交时间的 ISO 字符串', () => {
    exec.mockImplementation((_cmd: any, args: any[]) => {
      if (args.includes('log')) return '1760000000\n';
      return '';
    });

    expect(getFileLastCommitIso('/tmp/gauss-get-lastmod', 'docs/zh/a.md')).toBe(new Date(1760000000 * 1000).toISOString());
  });

  it('查询失败时返回空字符串', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    exec.mockImplementation(() => {
      throw new Error('not a git repo');
    });

    expect(getFileLastCommitIso('/tmp/gauss-get-lastmod-fail', 'docs/zh/a.md')).toBe('');
    expect(warn).toHaveBeenCalled();
  });
});

describe('getDirectoryLastCommitMap', () => {
  it('解析 name-only log，并为每个文件保留最近一次提交时间', () => {
    const repoDir = '/tmp/gauss-lastmod-map-repo';
    exec.mockImplementation((_cmd: any, args: any[]) => {
      if (args[0] === 'rev-parse') return 'abc123\n';
      if (args.includes('log')) {
        return [`\u00011760000000`, 'docs/zh/a.md', '', `\u00011750000000`, 'docs/zh/b.md', 'docs/zh/a.md', ''].join('\n');
      }
      return '';
    });

    const map = getDirectoryLastCommitMap(repoDir, 'docs/zh');

    expect(map.get('docs/zh/a.md')).toBe(new Date(1760000000 * 1000).toISOString());
    expect(map.get('docs/zh/b.md')).toBe(new Date(1750000000 * 1000).toISOString());
    expect(exec).toHaveBeenCalledWith('git', expect.arrayContaining(['log', '--name-only', 'docs/zh']), expect.any(Object));
  });

  it('同仓库同 HEAD 同目录时复用缓存', () => {
    const repoDir = '/tmp/gauss-lastmod-map-cache';
    let logCallCount = 0;
    exec.mockImplementation((_cmd: any, args: any[]) => {
      if (args[0] === 'rev-parse') return 'abc123\n';
      if (args.includes('log')) {
        logCallCount += 1;
        return `\u00011760000000\ndocs/en/a.md\n`;
      }
      return '';
    });

    getDirectoryLastCommitMap(repoDir, 'docs/en');
    getDirectoryLastCommitMap(repoDir, 'docs/en');

    expect(logCallCount).toBe(1);
  });

  it('批量查询失败时返回空 map', () => {
    const repoDir = '/tmp/gauss-lastmod-map-fail';
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    exec.mockImplementation((_cmd: any, args: any[]) => {
      if (args[0] === 'rev-parse') return 'abc123\n';
      if (args.includes('log')) throw new Error('log failed');
      return '';
    });

    const map = getDirectoryLastCommitMap(repoDir, 'docs/zh');

    expect(map.size).toBe(0);
    expect(warn).toHaveBeenCalled();
  });
});
