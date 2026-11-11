import { load as parseYaml } from 'js-yaml';
import type { SiteConfig } from 'vitepress';
import { defineLoader } from 'vitepress';

import { extractVersionKey, parseEolTime } from '../utils/version';

// 版本停维元数据地址（构建时在 Node 端拉取）
const VERSIONS_META_URL = 'https://raw.atomgit.com/opengauss/website/raw/v2/.content/download/versions.yaml';
const FETCH_TIMEOUT = 15000; // 拉取上游版本元数据的超时时间（毫秒）

// 本地版本配置（不含停维信息）
const rawVersions: Record<'zh' | 'en', RawVersionItemT[]> = {
  zh: [
    {
      label: 'latest (DEV)',
      value: 'latest',
      link: {
        enterprise: '/zh/docs/latest/release_notes/release_notes.html',
        lite: '/zh/docs/latest-lite/release_notes/release_notes.html',
      },
    },
    {
      label: '7.0.0 (LTS)',
      value: '7.0.0',
      link: {
        enterprise: '/zh/docs/7.0.0/release_notes/release_notes.html',
        lite: '/zh/docs/7.0.0-lite/release_notes/release_notes.html',
      },
    },
    {
      label: '7.0.0-RC3 (RC)',
      value: '7.0.0-RC3',
      link: {
        enterprise: '/zh/docs/7.0.0-RC3/release_notes/release_notes.html',
        lite: '/zh/docs/7.0.0-RC3-lite/release_notes/release_notes.html',
      },
    },
    {
      label: '7.0.0-RC2 (RC)',
      value: '7.0.0-RC2',
      href: '/zh/docs/7.0.0-RC2/docs/GettingStarted/GettingStarted.html',
    },
    {
      label: '7.0.0-RC1 (RC)',
      value: '7.0.0-RC1',
      href: '/zh/docs/7.0.0-RC1/docs/GettingStarted/GettingStarted.html',
    },
    {
      label: '6.0.0 (LTS)',
      value: '6.0.0',
      href: '/zh/docs/6.0.0/docs/GettingStarted/GettingStarted.html',
    },
    {
      label: '6.0.0-RC1 (RC)',
      value: '6.0.0-RC1',
      href: '/zh/docs/6.0.0-RC1/docs/GettingStarted/GettingStarted.html',
    },
    {
      label: '5.1.0 (Preview)',
      value: '5.1.0',
      href: '/zh/docs/5.1.0/docs/GettingStarted/GettingStarted.html',
    },
    {
      label: '5.0.0 (LTS)',
      value: '5.0.0',
      href: '/zh/docs/5.0.0/docs/GettingStarted/GettingStarted.html',
    },
    {
      label: '3.0.0 (LTS)',
      value: '3.0.0',
      href: '/zh/docs/3.0.0/docs/BriefTutorial/BriefTutorial.html',
    },
    {
      label: '2.0.0 (LTS)',
      value: '2.0.0',
      href: '/zh/docs/2.0.0/docs/Quickstart/%E4%BA%86%E8%A7%A3%E4%BA%A7%E5%93%81.html',
    },
    {
      label: '3.1.1 (EOM)',
      value: '3.1.1',
      archive: true,
      href: '/zh/docs/3.1.1/docs/BriefTutorial/BriefTutorial.html',
    },
    {
      label: '3.1.0 (EOM)',
      value: '3.1.0',
      archive: true,
      href: '/zh/docs/3.1.0/docs/BriefTutorial/BriefTutorial.html',
    },
    {
      label: '2.1.0 (EOM)',
      value: '2.1.0',
      archive: true,
      href: '/zh/docs/2.1.0/docs/Quickstart/%E4%BA%86%E8%A7%A3%E4%BA%A7%E5%93%81.html',
    },
    {
      label: '2.0.1 (EOM)',
      value: '2.0.1',
      archive: true,
      href: '/zh/docs/2.0.1/docs/Quickstart/%E4%BA%86%E8%A7%A3%E4%BA%A7%E5%93%81.html',
    },
    {
      label: '1.1.0 (EOM)',
      value: '1.1.0',
      archive: true,
      href: '/zh/docs/1.1.0/docs/Quickstart/%E4%BA%86%E8%A7%A3%E4%BA%A7%E5%93%81.html',
    },
    {
      label: '1.0.1 (EOM)',
      value: '1.0.1',
      archive: true,
      href: '/zh/docs/1.0.1/docs/Quickstart/%E4%BA%86%E8%A7%A3%E4%BA%A7%E5%93%81.html',
    },
    {
      label: '1.0.0 (EOM)',
      value: '1.0.0',
      archive: true,
      href: '/zh/docs/1.0.0/docs/Quickstart/Quickstart.html',
    },
  ],
  en: [
    {
      label: 'latest (DEV)',
      value: 'latest',
      link: {
        enterprise: '/en/docs/latest/release_notes/release_notes.html',
        lite: '/en/docs/latest-lite/release_notes/release_notes.html',
      },
    },
    {
      label: '7.0.0 (LTS)',
      value: '7.0.0',
      link: {
        enterprise: '/en/docs/7.0.0/release_notes/release_notes.html',
        lite: '/en/docs/7.0.0-lite/release_notes/release_notes.html',
      },
    },
    {
      label: '7.0.0-RC3 (DEV)',
      value: '7.0.0-RC3',
      link: {
        enterprise: '/en/docs/7.0.0-RC3/release_notes/release_notes.html',
        lite: '/en/docs/7.0.0-RC3-lite/release_notes/release_notes.html',
      },
    },
    {
      label: '7.0.0-RC2 (RC)',
      value: '7.0.0-RC2',
      href: '/en/docs/7.0.0-RC2/docs/GettingStarted/GettingStarted.html',
    },
    {
      label: '7.0.0-RC1 (RC)',
      value: '7.0.0-RC1',
      href: '/en/docs/7.0.0-RC1/docs/GettingStarted/GettingStarted.html',
    },
    {
      label: '6.0.0 (LTS)',
      value: '6.0.0',
      href: '/en/docs/6.0.0/docs/GettingStarted/GettingStarted.html',
    },
    {
      label: '6.0.0-RC1 (RC)',
      value: '6.0.0-RC1',
      href: '/en/docs/6.0.0-RC1/docs/GettingStarted/GettingStarted.html',
    },
    {
      label: '5.1.0 (Preview)',
      value: '5.1.0',
      href: '/en/docs/5.1.0/docs/GettingStarted/GettingStarted.html',
    },
    {
      label: '5.0.0 (LTS)',
      value: '5.0.0',
      href: '/en/docs/5.0.0/docs/GettingStarted/GettingStarted.html',
    },
    {
      label: '3.0.0 (LTS)',
      value: '3.0.0',
      href: '/en/docs/3.0.0/docs/BriefTutorial/BriefTutorial.html',
    },
    {
      label: '2.0.0 (LTS)',
      value: '2.0.0',
      href: '/en/docs/2.0.0/docs/Quickstart/learning-product-knowledge.html',
    },
    {
      label: '3.1.1 (EOM)',
      value: '3.1.1',
      archive: true,
      href: '/en/docs/3.1.1/docs/BriefTutorial/BriefTutorial.html',
    },
    {
      label: '3.1.0 (EOM)',
      value: '3.1.0',
      archive: true,
      href: '/en/docs/3.1.0/docs/BriefTutorial/BriefTutorial.html',
    },
    {
      label: '2.1.0 (EOM)',
      value: '2.1.0',
      archive: true,
      href: '/en/docs/2.1.0/docs/Quickstart/learning-product-knowledge.html',
    },
    {
      label: '2.0.1 (EOM)',
      value: '2.0.1',
      archive: true,
      href: '/en/docs/2.0.1/docs/Quickstart/learning-product-knowledge.html',
    },
    {
      label: '1.1.0 (EOM)',
      value: '1.1.0',
      archive: true,
      href: '/en/docs/1.1.0/docs/Quickstart/learning-product-knowledge.html',
    },
    {
      label: '1.0.1 (EOM)',
      value: '1.0.1',
      archive: true,
      href: '/en/docs/1.0.1/docs/Quickstart/learning-product-knowledge.html',
    },
    {
      label: '1.0.0 (EOM)',
      value: '1.0.0',
      archive: true,
      href: '/en/docs/1.0.0/docs/Quickstart/Quickstart.html',
    },
  ],
};

export interface VersionLinkT {
  enterprise: string;
  lite: string;
}

// 带停维信息的版本项
export interface VersionItemT {
  label: string;
  value: string;
  href?: string;
  link?: VersionLinkT;
  archive?: boolean;
  plannedEol: string;
  eol: boolean;
}

export interface VersionsT {
  zh: VersionItemT[];
  en: VersionItemT[];
}

type RawVersionItemT = Omit<VersionItemT, 'plannedEol' | 'eol'>;

interface VersionMetaT {
  version_name: string;
  planned_eol?: string;
}

declare const data: VersionsT;
export { data };

/**
 * 输出构建期告警
 * @param {string} message 告警内容
 */
function logLoaderWarn(message: string): void {
  const config = (globalThis as { VITEPRESS_CONFIG?: SiteConfig }).VITEPRESS_CONFIG;

  // 拿不到 VitePress logger 时忽略，不影响构建
  if (config) {
    config.logger.warn(`${message}\n`);
  }
}

/**
 * 判断 yaml 条目是否为版本元数据
 * @param {unknown} value yaml 条目
 * @returns {boolean} 是否为版本元数据
 */
function isVersionMeta(value: unknown): value is VersionMetaT {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  // 缺少版本名的条目不是版本元数据
  if (!('version_name' in value) || typeof value.version_name !== 'string') {
    return false;
  }

  return true;
}

/**
 * 构建时拉取上游 versions.yaml，得到版本号到停止维护时间的映射
 * @returns {Promise<Record<string, string>>} 版本号 => planned_eol
 */
async function fetchEolMap(): Promise<Record<string, string>> {
  const eolMap: Record<string, string> = {};
  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort();
  }, FETCH_TIMEOUT);

  try {
    const response = await fetch(VERSIONS_META_URL, { signal: controller.signal });

    // 上游返回异常状态码时不做合并
    if (!response.ok) {
      throw new Error(`请求失败：${response.status} ${response.statusText}`);
    }

    const metaList = parseYaml(await response.text());

    // 顶层结构不是列表时不做合并
    if (!Array.isArray(metaList)) {
      throw new Error('versions.yaml 顶层结构不是列表');
    }

    for (const meta of metaList) {
      // 跳过非版本元数据条目
      if (!isVersionMeta(meta)) {
        continue;
      }

      eolMap[extractVersionKey(meta.version_name)] = meta.planned_eol ?? '';
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);

    logLoaderWarn(`[version] 获取版本停止维护信息失败，将仅使用本地归档标记：${reason}`);
  } finally {
    clearTimeout(timer);
  }

  return eolMap;
}

/**
 * 为每个版本合并停止维护时间与停维标记
 * @param {RawVersionItemT[]} list 本地版本列表
 * @param {Record<string, string>} eolMap 版本号到 planned_eol 的映射
 * @param {number} now 构建时的时间戳
 * @returns {VersionItemT[]} 带停维信息的版本列表
 */
function markVersions(list: RawVersionItemT[], eolMap: Record<string, string>, now: number): VersionItemT[] {
  return list.map((item) => {
    const plannedEol = eolMap[item.value] ?? '';
    const eolTime = parseEolTime(plannedEol);

    // 停维时间缺失或无法解析时，只沿用本地归档标记
    if (Number.isNaN(eolTime)) {
      return { ...item, plannedEol, eol: item.archive === true };
    }

    return { ...item, plannedEol, eol: item.archive === true || eolTime < now };
  });
}

export default defineLoader({
  async load(): Promise<VersionsT> {
    const eolMap = await fetchEolMap();
    const now = Date.now();

    return {
      zh: markVersions(rawVersions.zh, eolMap, now),
      en: markVersions(rawVersions.en, eolMap, now),
    };
  },
});
