<script setup lang="ts">
import { nextTick, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useData, useRoute } from 'vitepress';
import { OScroller, OIcon, OAnchor, OAnchorItem, isClient } from '@opensig/opendesign';

import IconSwitch from '~icons/app/icon-switch.svg';

import type { AnchorItemT } from '@/@types/type-common';
import { useScreen } from '@/composables/useScreen';
import { scrollIntoView } from '@/utils/scroll-to';
import { useViewStore } from '@/stores/view';
import { useLocale } from '@/composables/useLocale';
import { getDomId } from '@/utils/common';
import { isElementVisible } from '@/utils/element';
import { useDebounceFn } from '@vueuse/core';

const route = useRoute();
const viewStore = useViewStore();
const { leLaptop } = useScreen();
const { hash } = useData();
const { t } = useLocale();

const anchorScrollerRef = ref();
const expanded = ref(false);
const anchorData = ref<AnchorItemT[]>([]);
const scrollContainer = ref<HTMLElement>();

// -------------------- 获取锚点数据 --------------------
const getAnchorItem = (element: HTMLElement) => {
  return {
    tag: element.tagName.toLowerCase(),
    title: element.innerText.replace(/[\u200B-\u200D\uFEFF]/g, ''),
    href: `#${element.id}`,
    children: [],
  };
};

const getAnchorData = () => {
  anchorData.value = [];
  if (!isClient) {
    return;
  }

  const markdownBody = document.querySelector('.markdown-body');
  if (!markdownBody) {
    return;
  }

  let lastItem: AnchorItemT;
  let lastItemIsH2 = false;
  Array.from(markdownBody.querySelectorAll<HTMLElement>('h2, h3')).forEach((element) => {
    // h2
    if (element.tagName === 'H2') {
      lastItem = getAnchorItem(element);
      anchorData.value.push(lastItem);
      lastItemIsH2 = true;
      return;
    }

    // h3
    if (lastItemIsH2) {
      lastItem.children!.push(getAnchorItem(element));
    } else {
      anchorData.value.push(getAnchorItem(element));
    }
  });
};

watch(
  () => route.path,
  async () => {
    anchorData.value = [];
    await nextTick();
    getAnchorData();
  },
  {
    immediate: true,
  }
);

// -------------------- 判断锚点是否可见 --------------------
const onScroll = useDebounceFn(() => {
  const anchorScroller = anchorScrollerRef.value?.getContainerEl() as HTMLElement;
  if (!anchorScroller) {
    return;
  }

  const el = anchorScroller.querySelector('.is-active') as HTMLElement;
  if (!el) {
    return;
  }
  
  if (!isElementVisible(el, anchorScroller, el.offsetHeight)) {
    scrollIntoView(el, anchorScroller);
  }
}, 200);

onMounted(() => {
  scrollContainer.value = document.querySelector<HTMLElement>('#app > .o-scroller > .o-scroller-container')!;
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', onScroll);
  }
});

onBeforeUnmount(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', onScroll);
  }
});

// -------------------- 监听hash改变 --------------------

const scrollIntoTarget = async (hashVal: string) => {
  if (viewStore.isScrolling) {
    return;
  }

  viewStore.isScrolling = true;
  if (hashVal) {
    const contentDom = document.querySelector('.markdown-body');
    if (contentDom) {
      const hash = decodeURIComponent(hashVal).slice(1);
      const target =
        contentDom.querySelector<HTMLElement>(`#user-content-${hash}`) ||
        contentDom.querySelector<HTMLElement>(`#user-content-${getDomId(hash)}`) ||
        contentDom.querySelector<HTMLElement>(`#${hash}`) ||
        contentDom.querySelector<HTMLElement>(`[name='${hash}']`);
      if (target && scrollContainer.value) {
        await scrollIntoView(target, scrollContainer.value);
      }
    }
  }

  viewStore.isScrolling = false;
};

onMounted(() => {
  scrollContainer.value = document.querySelector<HTMLElement>('#app > .o-scroller > .o-scroller-container')!;
  setTimeout(async () => {
    await scrollIntoTarget(hash.value);
  }, 300);
});

watch(
  () => hash.value,
  async (newHash) => {
    await scrollIntoTarget(newHash);
  }
);

const onClickAnchor = (_evt: MouseEvent, link?: string) => {
  if (!link || !link?.trim()) {
    return;
  }

  history.pushState(null, '', link.replace('user-content-', ''));
}
</script>

<template>
  <div v-if="anchorData.length > 0" class="doc-anchor" :class="{ unexpanded: leLaptop && !expanded }">
    <div class="anchor-wrapper" :class="{ unexpanded: leLaptop && !expanded }">
      <div class="anchor-title">{{ t('docs.anchorTip') }}</div>
      <OScroller ref="anchorScrollerRef" class="anchor-scroller" show-type="hover" size="small" disabled-x auto-update-on-scroll-size>
        <OAnchor :container="scrollContainer" :change-hash="false" :target-offset="32" size="small" @click="onClickAnchor">
          <OAnchorItem v-for="item in anchorData" :key="item.href" :href="item.href" :title="item.title">
            <OAnchorItem v-for="subItem in item.children" :key="subItem.href" :href="subItem.href" :title="subItem.title"></OAnchorItem>
          </OAnchorItem>
        </OAnchor>
      </OScroller>
    </div>

    <div class="anchor-opener" :class="{ unexpanded: leLaptop && !expanded }" @click="expanded = !expanded">
      <OIcon>
        <IconSwitch></IconSwitch>
      </OIcon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.doc-anchor {
  position: fixed;
  top: var(--layout-doc-anchor-top);
  right: var(--layout-doc-anchor-offset-right);
  width: var(--layout-doc-anchor-width);
  z-index: 9;

  @include respond('pad-laptop') {
    right: 0;
  }

  @include respond('phone') {
    display: none;
  }
}

.anchor-wrapper {
  @include respond('pad-laptop') {
    padding: 16px 12px;
    background-color: var(--o-color-fill2);
    border-radius: var(--o-radius-xs);
    box-shadow: var(--o-shadow-2);
  }
}

.anchor-wrapper.unexpanded {
  display: none;
}

.anchor-title {
  margin-bottom: 12px;
  font-weight: 600;
  @include text1;
}

.anchor-scroller {
  max-height: calc(100vh - 700px);
  padding-right: 24px;

  @include respond('pad-laptop') {
    max-height: calc(100vh - 750px);
    padding-right: 6px;
  }
}

.anchor-opener {
  z-index: 9;
  display: none;
  position: absolute;
  right: 0;
  top: 0;
  padding: 12px;
  font-size: 24px;
  cursor: pointer;

  @include respond('pad-laptop') {
    display: block;
  }
}

.anchor-opener.unexpanded {
  position: fixed;
  right: 0;
  top: var(--layout-doc-anchor-top);
  background-color: var(--o-color-fill2);
  border-radius: 0 100px 100px 0;
  box-shadow: var(--o-shadow-2);
  transform: scaleX(-1);
}
</style>
