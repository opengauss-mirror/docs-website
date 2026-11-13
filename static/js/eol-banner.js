// 浏览器端"停止维护"(EOM)实时判断，数据来自 window.OPENGAUSS_EOL_DATA（static/js/eol-data.js，
// 构建时由 scripts/gen-eol-versions.sh 基于 versions.yaml 的 planned_eol 生成）。包含两件事：
// 1. 横幅校正：SSG 阶段按构建时生成的 data/eolVersions.yaml 渲染"停止维护"横幅，但构建时间固定，
//    版本可能在构建之后才越过 planned_eol；本脚本在页面加载时用当前时间比较，补充渲染或移除横幅。
// 2. 版本状态校正：version-data.js（versionObjZh/versionObjEn）里的 state 是手工维护的静态值，
//    本脚本用 planned_eol 与当前时间重算——已越期则改为 "EOM"，误标 EOM 但未越期则按 versions.yaml
//    的在维期状态（eol-data.js 的 state 字段，取自版本名后缀 LTS/Preview/RC）回写。
//    本脚本在 version.js/docdetail.js 的 ready 回调之前执行，版本切换下拉框等消费方能拿到修正后的 state。
(function () {
  var TEXTS = {
    zh: {
      tag: '停止维护',
      notice: '本文档已停止维护，建议查阅最新版本文档。',
    },
    en: {
      tag: 'Outdated',
      notice: 'This document is no longer maintained. Refer to the latest version.',
    },
  };

  // 从 URL /{lang}/docs/{version}/... 中提取当前文档版本目录名，lite 版去掉 -lite 后缀
  function getCurrentVersion() {
    var m = location.pathname.match(/\/docs\/([^/]+)\//);
    if (!m) return '';
    var version = m[1];
    try {
      version = decodeURIComponent(version);
    } catch (e) {
      /* 保留原始值 */
    }
    return version.replace(/-lite$/, '');
  }

  // planned_eol 格式为 YYYY.MM.DD 或 YYYY.MM，缺日时按当月 1 日计；与 eol-data.js 头部注释口径一致
  function parseEolDate(value) {
    var parts = String(value || '').split('.');
    if (parts.length < 2 || !Number(parts[0]) || !Number(parts[1])) return null;
    return new Date(Number(parts[0]), Number(parts[1]) - 1, parts[2] ? Number(parts[2]) : 1);
  }

  // 按 planned_eol 校正 versionObjZh/versionObjEn 中的 state（到期 EOM / 误标回退在维期状态）
  function syncVersionObjState() {
    var data = window.OPENGAUSS_EOL_DATA || {};
    var now = Date.now();
    var objs = [];
    if (typeof versionObjZh === 'object' && versionObjZh) objs.push(versionObjZh);
    if (typeof versionObjEn === 'object' && versionObjEn) objs.push(versionObjEn);
    objs.forEach(function (obj) {
      Object.keys(obj).forEach(function (key) {
        var entry = data[key];
        var eolDate = entry ? parseEolDate(entry.eol) : null;
        if (!eolDate) return; // 无该版本数据（如 latest），保持 version-data.js 原有 state
        var item = obj[key];
        if (!item) return;
        if (now >= eolDate.getTime()) {
          item.state = 'EOM';
        } else if (item.state === 'EOM' && entry.state) {
          item.state = entry.state;
        }
      });
    });
  }

  // 与 layouts/docs/baseof.html 中 SSG 渲染的横幅保持一致的标记与样式
  function buildBanner() {
    var lang = (document.documentElement.getAttribute('lang') || '').indexOf('en') === 0 ? 'en' : 'zh';
    var banner = document.createElement('div');
    banner.id = 'eol-banner';
    banner.style.cssText =
      'padding: 16px; border-radius: 4px; background-color: rgba(255, 204, 204, 0.48); margin-bottom: 20px; font-size: 14px;';
    var tag = document.createElement('span');
    tag.style.cssText =
      'display: inline-block; color: #fff; padding: 1px 8px; border-radius: 4px; background-color: #e60012; margin-right: 8px; font-size: 12px;';
    tag.textContent = TEXTS[lang].tag;
    var notice = document.createElement('span');
    notice.textContent = TEXTS[lang].notice;
    banner.appendChild(tag);
    banner.appendChild(notice);
    return banner;
  }

  function checkEolBanner() {
    var data = window.OPENGAUSS_EOL_DATA || {};
    var version = getCurrentVersion();
    if (!version) return;
    var entry = data[version];
    var eolDate = entry ? parseEolDate(entry.eol) : null;
    if (!eolDate) return; // 无该版本数据（如 latest），维持 SSG 渲染结果
    var banner = document.getElementById('eol-banner');
    var isEOL = new Date().getTime() >= eolDate.getTime();
    if (isEOL === !!banner) return; // 与 SSG 渲染结果一致，无需处理
    var page = document.querySelector('.page-content');
    if (!page) return;
    if (isEOL) {
      page.insertBefore(buildBanner(), page.firstChild);
    } else {
      banner.parentNode.removeChild(banner);
    }
  }

  // version.js 等在 $(document).ready 中消费 state，这里在脚本求值阶段（ready 之前）立即同步
  syncVersionObjState();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkEolBanner);
  } else {
    checkEolBanner();
  }
})();
