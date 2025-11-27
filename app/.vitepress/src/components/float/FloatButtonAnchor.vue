<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick, computed } from 'vue';
import { useData, useRoute } from 'vitepress';
import { isClient, OIcon, ODialog, OScroller } from '@opensig/opendesign';

import IconAnchor from '~icons/feedback/icon-anchor.svg';

import type { AnchorItemT } from '@/@types/type-common';
import { getOffsetTop, getScrollRemainingBottom, isElementVisible } from '@/utils/element';
import { scrollIntoView } from '@/utils/scroll-to';
import { useViewStore } from '@/stores/view';
import { useLocale } from '@/composables/useLocale';

const route = useRoute();
const viewStore = useViewStore();
const { hash } = useData();
const { t } = useLocale();

const anchorScrollerRef = ref();
const showDlg = ref(false);
const anchorData = ref<AnchorItemT[]>([]);
const activeVal = ref(hash.value);

const showAnchor = computed(() => {
  return anchorData.value.length > 0;
});

const onShow = () => {
  if (showAnchor.value) {
    showDlg.value = true;
  }
};

// -------------------- 显示弹窗滚动到当前选中锚点位置 --------------------
const scrollToIndicatorPosition = async () => {
  if (!isClient) {
    return;
  }

  await nextTick();
  await nextTick();

  const anchorScroller = anchorScrollerRef.value?.getContainerEl() as HTMLElement;
  if (!anchorScroller) {
    return;
  }

  const el = anchorScroller.querySelector('.dlg-anchor-item-link.is-active') as HTMLElement;
  if (!el) {
    return;
  }

  if (!isElementVisible(el, anchorScroller, el.offsetHeight)) {
    scrollIntoView(el, anchorScroller);
  }
};

watch(showDlg, (val) => {
  if (val) {
    scrollToIndicatorPosition();
  }
});

// -------------------- 更新 active  --------------------
const updateActive = async (hashVal: string) => {
  if (hashVal === '') {
    activeVal.value = '';
    return;
  }

  const href = decodeURIComponent(hashVal);
  if (anchorData.value.some((item) => item.href === href)) {
    activeVal.value = href;
  }
};

// -------------------- 获取锚点数据 --------------------
const getAnchorData = () => {
  if (!isClient) {
    return;
  }

  anchorData.value = [];
  const markdownBody = document.querySelector('.markdown-body');
  if (!markdownBody) {
    return;
  }

  Array.from(markdownBody.querySelectorAll<HTMLElement>('h2, h3')).forEach((element) => {
    anchorData.value.push({
      tag: element.tagName.toLowerCase(),
      title: element.innerText.replace(/[\u200B-\u200D\uFEFF]/g, ''),
      href: `#${element.id.replace('user-content-', '')}`,
    });
  });
};

watch(
  () => route.path,
  async () => {
    anchorData.value = [];
    await nextTick();
    getAnchorData();
    updateActive(hash.value);
  },
  {
    immediate: true,
  }
);

// -------------------- 滚动更新锚点 --------------------
const onScroll = () => {
  if (viewStore.isScrolling) {
    return;
  }

  const scrollContainer = document.querySelector<HTMLElement>('#app > .o-scroller > .o-scroller-container');
  if (!scrollContainer) {
    return;
  }

  const contentDom = document.querySelector('.markdown-body');
  if (!contentDom) {
    return;
  }

  const scrollRemainingBottom = getScrollRemainingBottom(scrollContainer);
  const distances: Array<{ hash: string; top: number }> = [];
  for (const item of anchorData.value) {
    const target = contentDom.querySelector<HTMLElement>(item.href.replace('#', '#user-content-'));
    if (!target) {
      continue;
    }

    const top = getOffsetTop(target, scrollContainer);

    if (top < 110 || (scrollRemainingBottom < 100 && top >= 110)) {
      distances.push({
        hash: item.href,
        top,
      });
    }
  }

  let active = '';
  if (distances.length) {
    if (scrollRemainingBottom < 10) {
      active = distances[distances.length - 1].hash;
    } else if (scrollRemainingBottom < 110) {
      const overItems = distances.filter((item) => item.top >= 110);
      if (overItems.length) {
        const average = Math.round(110 / overItems.length);
        const item = overItems.find((_, i) => (i + 1) * average < 110 - scrollRemainingBottom);
        if (item) {
          active = item.hash;
        }
      }
    } else {
      const max = distances.reduce((prev, cur) => (prev.top > cur.top ? prev : cur));
      active = max.hash;
    }
  }

  updateActive(active);
};

onMounted(() => {
  const scrollContainer = document.querySelector<HTMLElement>('#app > .o-scroller > .o-scroller-container');
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', onScroll);
  }
});

onBeforeUnmount(() => {
  const scrollContainer = document.querySelector<HTMLElement>('#app > .o-scroller > .o-scroller-container');
  if (scrollContainer) {
    scrollContainer.removeEventListener('scroll', onScroll);
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
        contentDom.querySelector<HTMLElement>(`#${hash}`) ||
        contentDom.querySelector<HTMLElement>(`[name='${hash}']`);
      const scrollContainer = document.querySelector<HTMLElement>('#app > .o-scroller > .o-scroller-container');
      if (target && scrollContainer) {
        await scrollIntoView(target, scrollContainer, 60);
      }
    }
  }

  viewStore.isScrolling = false;
};

onMounted(() => {
  setTimeout(async () => {
    await scrollIntoTarget(activeVal.value);
    if (!anchorData.value.some((item) => item.href === activeVal.value)) {
      onScroll();
    }
  }, 300);
});

watch(
  () => hash.value,
  async (newHash) => {
    updateActive(newHash);
    await scrollIntoTarget(newHash);
    if (!anchorData.value.some((item) => item.href === activeVal.value)) {
      onScroll();
    }
  }
);
</script>

<template>
  <div class="float-btn-anchor" :class="{ 'float-btn-anchor-hidden': !showAnchor }" @click="onShow">
    <OIcon class="icon-anchor">
      <IconAnchor />
    </OIcon>
  </div>

  <ODialog
    v-model:visible="showDlg"
    :style="{ '--dlg-edge-gap': '16px 24px', '--dlg-body-padding': '24px 24px 16px', '--dlg-radius': '4px' }"
    :scroller="false"
    main-class="float-dlg-anchor"
  >
    <div class="dlg-anchor-title">{{ t('docs.anchorTip') }}</div>
    <OScroller ref="anchorScrollerRef" class="dlg-anchor-scroller" size="small" show-type="never" :disabled-x="true">
      <div v-for="item in anchorData" :key="item.href" class="dlg-anchor-item" @click="showDlg = false">
        <a
          :href="item.href"
          target="_self"
          class="dlg-anchor-item-link"
          :class="{ 'is-active': activeVal === item.href, 'dlg-anchor-item-link-sub-item': item.tag === 'h3' }"
          >{{ item.title }}</a
        >
      </div>
    </OScroller>
  </ODialog>
</template>

<style lang="scss">
.float-dlg-anchor {
  --dlg-width: 100%;

  .dlg-anchor-title {
    margin-bottom: 10px;
    font-weight: 500;
    text-align: center;
    @include display3;
  }

  .dlg-anchor-scroller {
    max-height: 50vh;
  }

  .dlg-anchor-item {
    @include text2;
  }

  .dlg-anchor-item-link {
    color: var(--o-color-info2);
    display: block;
    padding: 12px 16px;
    border-radius: var(--o-radius-xs);
  }

  .dlg-anchor-item-link.is-active {
    color: var(--o-color-primary1);
    background-color: var(--o-color-fill3);
    font-weight: 500px;
  }

  .dlg-anchor-item-link-sub-item {
    padding-left: 24px;
  }
}
</style>

<style lang="scss" scoped>
.float-btn-anchor {
  display: flex;
  flex-direction: column;
  padding: 12px;
  margin-bottom: 8px;
  background-color: var(--o-color-fill2);
  border-radius: var(--o-radius-xs);
  box-shadow: var(--o-shadow-2);
  color: var(--o-color-info1);
  cursor: pointer;
}

.float-btn-anchor-hidden {
  opacity: 0;
  cursor: default;
}

[data-o-theme='dark'] {
  .float-btn-anchor {
    border: 1px solid var(--o-color-control4-light);
  }
}

.icon-anchor {
  font-size: var(--o-font_size-h2);
}
</style>
