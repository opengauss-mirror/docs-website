<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, shallowRef, watch } from 'vue';
import { useRoute, useRouter } from 'vitepress';
import { useMessage } from '@opensig/opendesign';

import DocPagination from './DocPagination.vue';
import DocViewSource from './DocViewSource.vue';
import DocBug from './DocBug.vue';

import { useLocale } from '@/composables/useLocale';
import useReadingTime from '@/composables/useReadingTime.js';
import { useVersionStore } from '@/stores/version';
import { useViewStore } from '@/stores/view';
import { oaReport } from '@opendesign-plus/plugins';
import { useNodeStore } from '@/stores/node.js';

const emits = defineEmits<{
  (evt: 'update-menu-expaned'): void;
  (evt: 'change-anchor', value: string): void;
  (evt: 'page-change', type: 'prev' | 'next'): void;
  (evt: 'click-hash-link'): void;
}>();

const viewStore = useViewStore();
const nodeStore = useNodeStore();

// -------------------- 处理跨语言、跨指南跳转 --------------------
const router = useRouter();
const versionStore = useVersionStore();

const onBeforeRouteChangeFn = [
  (to: string) => {
    const [_1, _2, maybeLite, maybeLange, ...paths] = to.split('/');

    // 企业版跳轻量版
    if (maybeLite === 'docs-lite') {
      router.go(`/${maybeLange}/docs/${versionStore.prefixVersion}-lite/${paths.join('/')}`);
      return false;
    }

    // 中文跳英文页面
    if (maybeLange === 'zh' || maybeLange === 'en') {
      const [_4, _5, _6, version] = window.location.pathname.split('/');
      router.go(`/${maybeLange}/docs/${version}/${paths.join('/')}`);
      return false;
    }
    return true;
  },
] as any[];

// -------------------- 代码块复制 --------------------
const { t } = useLocale();
const message = useMessage(null);
const route = useRoute();

const popMessage = (ev: Event) => {
  message.success({ content: t('docs.copySuccess') });
  reportCopyClick(ev.target as HTMLElement)
};

const copyDoc = () => {
  const buttonCopy = Array.from(document.querySelectorAll('.copy'));
  for (let index = 0; index < buttonCopy.length; index++) {
    buttonCopy[index].addEventListener('click', popMessage);
  }
};

watch(
  () => route.path,
  async () => {
    await nextTick();
    copyDoc();
  }
);

onMounted(() => {
  copyDoc();
});

onUpdated(() => {
  copyDoc();
});

onBeforeUnmount(() => {
  const buttonCopy = Array.from(document.querySelectorAll('.copy'));
  for (let index = 0; index < buttonCopy.length; index++) {
    buttonCopy[index].removeEventListener('click', popMessage);
  }
});

// ------------埋点------------
useReadingTime();
onBeforeRouteChangeFn.push(() => {
  const scrollContainer = document.querySelector<HTMLElement>('.o-scroller-container');
  if (!scrollContainer) return;
  oaReport('scroll', {
    scrollTop: scrollContainer.scrollTop,
    section: nodeStore?.currentNode?.id.slice(nodeStore?.currentNode?.id.lastIndexOf('#') + 1),
    path: nodeStore?.currentNode?.id,
    $url: location.origin + nodeStore?.currentNode?.id,
    title: document.title,
    perentage: ((scrollContainer.scrollTop * 100) / (scrollContainer.scrollHeight - scrollContainer.clientHeight)).toFixed(2) + '%',
  });
});

router.onBeforeRouteChange = (to) => {
  for (const fn of onBeforeRouteChangeFn) {
    if (fn(to) === false) {
      return false;
    }
  }
};

/** 当前目录路径 */
const currentTocPath = computed(() => {
  const path = [] as string[];
  let current = nodeStore.currentNode;
  const sp = route.path.split('/');
  let version;
  if (sp.length > 3) {
    version = sp[3];
  }
  while (current?.label) {
    path.unshift(current.label);
    current = current.parent;
  }
  if (!viewStore.isCustomView && !viewStore.isHomeView && !viewStore.isNoMenuView) {
    path.unshift(version as string);
  }
  return path;
});

const currentDocContentWrapperDiv = shallowRef<HTMLElement>();
if (typeof document !== 'undefined') {
  watch(
    () => route.path,
    async () => {
      await nextTick();
      currentDocContentWrapperDiv.value = document.querySelector('.markdown-body > div') as HTMLElement;
    },
    { immediate: true }
  );
}

/**
 * 上报代码块复制事件
 * @param button button
 */
const reportCopyClick = (button: Element) => {
  const content = button.parentElement?.querySelector('pre')?.textContent?.trim();
  let el = button;
  while (el) {
    if (!el.parentElement) return;
    if (el.parentElement === currentDocContentWrapperDiv.value) {
      break;
    }
    el = el.parentElement;
  }
  const pattern = /H[1-6]/;
  let currentLevel = Infinity;
  const titlePath = [];
  // 向上查找H元素，作为代码块所在路径的一部分
  while (el) {
    if (pattern.test(el.tagName)) {
      const level = Number(el.tagName.slice(1));
      if (level < currentLevel) {
        currentLevel = level;
        titlePath.unshift(el.textContent.replace(/\u200B/g, '').trim());
      }
    }
    el = el.previousElementSibling!;
  }
  oaReport(
    'click',
    {
      type: 'copy-code',
      $url: location.href,
      target: content,
      title: document.title,
      ...[...new Set([...currentTocPath.value, ...titlePath])].reduce(
        (acc, label, index) => {
          acc[`level_${index + 1}`] = label;
          return acc;
        },
        {} as Record<string, string>
      ),
    },
    'docs'
  );
};
</script>

<template>
  <div class="doc-body">
    <Content class="markdown-body" />
    <DocViewSource />
    <ClientOnly>
      <DocPagination @page-change="(type) => emits('page-change', type)" />
    </ClientOnly>
  </div>
  <ClientOnly>
    <DocBug v-if="!viewStore.isNoMenuView" />
  </ClientOnly>
</template>

<style lang="scss" scoped>
.doc-body {
  position: relative;
  min-height: var(--layout-doc-content-min-height);
  padding-top: var(--layout-doc-content-padding-top);
  padding-right: var(--layout-doc-content-padding-right);
  padding-bottom: var(--layout-doc-content-padding-bottom);
  padding-left: var(--layout-doc-content-padding-left);
  border-radius: var(--o-radius-xs);
  background: var(--o-color-fill2);
  display: flex;
  flex-direction: column;
  max-width: 100%;
}
</style>
