import { useVersionStore } from '@/stores/version';
import { useViewStore } from '@/stores/view';
import { oaReport } from '@opendesign-plus/plugins';
import { inBrowser, useData, useRoute } from 'vitepress';
import { nextTick, onMounted, onUnmounted, watch } from 'vue';

const useReadingTimenew = () => {
  const viewStore = useViewStore();
  const versionStore = useVersionStore();
  const currentReadingSections = new Set<{ start: HTMLElement; end: HTMLElement | null; startTime: number | null }>();
  const route = useRoute();
  const { page } = useData();
  
  let trackedPath = '';
  let trackedUrl = '';
  let trackedDocTitle = '';

  const syncTracked = () => {
    trackedPath = route.path;
    trackedUrl = location.href;
    trackedDocTitle = page.value.title || document.title;
  };

  const clearCurrentReadingSections = () => {
    // 如果当前阅读的章节中有内容,就上报阅读时长
    for (const section of currentReadingSections) {
      if (!section.startTime) continue;
      const duration = Date.now() - section.startTime;
      oaReport('sectionDuration', {
        section: section.start.innerText.replace(/[\u200B-\u200D\uFEFF]/g, '').trim(),
        $url: trackedUrl,
        title: trackedDocTitle,
        duration: duration,
        path: trackedPath,
        version: versionStore.version,
      });
      section.startTime = null;
    }
    currentReadingSections.clear();
  };

  if (inBrowser) {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        if (viewStore.isCustomView || viewStore.isHomeView) return;
        clearCurrentReadingSections();
      }
    });
  }

  let obs: IntersectionObserver | null = null;
  let sections = [] as { start: HTMLElement; end: HTMLElement | null; startTime: number | null }[];

  const updateObserver = () => {
    if (!obs) return;
    obs.disconnect();
    const mdContent = document.querySelector('.doc-body > .markdown-body > div');
    if (!mdContent) return;
    sections = [];
    for (const element of mdContent.children) {
      if (element.tagName === 'H2') {
        sections.push({
          start: element as HTMLElement,
          end: null,
          startTime: null,
        });
        continue;
      }
      if (!element.nextElementSibling || element.nextElementSibling.tagName === 'H2') {
        const current = sections[sections.length - 1];
        if (!current) continue;
        current.end = element as HTMLElement;
      }
    }
    if (sections.length === 0) return;
    sections.forEach((section) => {
      obs!.observe(section.start);
      obs!.observe(section.end!);
    });
  };

  onMounted(() => {
    syncTracked();
  });

  watch(
    () => route.path,
    async () => {
      await nextTick();
      clearCurrentReadingSections();
      syncTracked();
      updateObserver();
    }
  );

  onMounted(() => {
    // 滚动时上报文档各个部分停留（阅读）时间
    obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // H2作为某个部分的开头，从页面底部出现时开始阅读
          if (entry.isIntersecting && entry.intersectionRatio >= 1 && entry.target.tagName === 'H2') {
            const section = sections.find((section) => section.start === entry.target);
            if (!section) continue;
            currentReadingSections.add(section);
            section.startTime = Date.now();
            continue;
          }
          // H2的前一个元素作为某个部分的结尾，从页面顶部消失时算阅读结束
          if (!entry.isIntersecting && entry.intersectionRatio <= 0 && entry.target.tagName !== 'H2' && entry.boundingClientRect.top < entry.rootBounds!.top) {
            const section = sections.find((section) => section.end === entry.target);
            if (!section || !section.startTime) continue;
            const duration = Date.now() - section.startTime;
            section.startTime = null;
            currentReadingSections.delete(section);
            (window as any).__OA_REPORT__?.('sectionDuration', {
              $url: trackedUrl,
              title: trackedDocTitle,
              section: section.start.innerText.replace(/[\u200B-\u200D\uFEFF]/g, '').trim(),
              duration: duration,
              path: trackedPath,
              version: versionStore.version,
            });
            continue;
          }
          // 当某个H2从页面底部消失，将这一章从“当前正在阅读的章节”中移除
          if (!entry.isIntersecting && entry.intersectionRatio <= 0 && entry.target.tagName === 'H2' && entry.boundingClientRect.top >= window.innerHeight) {
            const section = sections.find((section) => section.start === entry.target);
            if (!section) continue;
            currentReadingSections.delete(section);
          }
        }
      },
      { threshold: [0, 1.0], rootMargin: '-80px 0px 0px 0px' }
    );
    updateObserver();
  });

  onUnmounted(() => {
    obs?.disconnect();
  });
};

export default useReadingTimenew;
