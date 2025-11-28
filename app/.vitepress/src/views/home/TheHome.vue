<script setup lang="ts">
import { ref, computed, watch, onUnmounted, onMounted } from 'vue';
import { onClickOutside } from '@vueuse/core';
import axios, { type Canceler } from 'axios';
import { OInput, OIcon, ORow, OCol, OLink, OPopup, ODropdownItem, OScroller } from '@opensig/opendesign';

import ContentWrapper from '@/components/ContentWrapper.vue';
import HomeFloat from './components/HomeFloat.vue';
import HomeBannerCard from './components/HomeBannerCard.vue';

import IconSearch from '~icons/app/icon-search.svg';

import { HOME_CONFIG, HOME_CONFIG_EN } from '@/config/dsl';
import { useAppearance } from '@/stores/common';
import { getSearchRecommend } from '@/api/api-search';

import { useScreen } from '@/composables/useScreen';
import { useLocale } from '@/composables/useLocale';

import type { SearchRecommendT } from '@/@types/type-search';
import type { HomeBannerItemT } from '@/@types/type-home';
import HomeSectionCard from './components/HomeSectionCard.vue';
import HomeFooter from './components/HomeFooter.vue';

const appearanceStore = useAppearance();
const { lePad, lePadV, isPhone, leLaptop } = useScreen();
const { locale, t } = useLocale();

const config = computed(() => {
  return locale.value === 'zh' ? HOME_CONFIG : HOME_CONFIG_EN;
});

const gap = computed(() => {
  if (isPhone.value) {
    return '12px';
  } else if (lePad.value) {
    return '16px';
  } else if (leLaptop.value) {
    return '24px';
  } else {
    return '32px';
  }
});

// -------------------- 搜索 --------------------
const searchValue = ref('');

const getSearchUrl = (val: string) => {
  return `${import.meta.env.VITE_MAIN_DOMAIN_URL}/${locale.value}/search/?q=${val.trim()}&type=docs`;
};

const enterSearchDoc = (val: string) => {
  reportSearch(val);
  clearTimeout(timer);
  if (!val.trim()) {
    return;
  }

  if (lastRecommendCanceler) {
    lastRecommendCanceler('cancel');
  }

  window.open(getSearchUrl(val), '_blank');
  showSearchWord.value = false;
};

const onClikHotWord = () => {
  if (lastRecommendCanceler) {
    lastRecommendCanceler('cancel');
  }
  showSearchWord.value = false;
};

const reportSearch = (val: string) => {
  if (!val.trim()) {
    return;
  }
  /* oaReport('input', {
    keyword: val.trim(),
    lang: locale.value,
    version: searchStore.version,
  }, 'search_docs'); */
};

// -------------------- 联想关键词 --------------------
let timer: number | NodeJS.Timeout | undefined;
let lastRecommendCanceler: Canceler | null;
const showSearchWord = ref(false);
const recommendData = ref<SearchRecommendT[]>([]);

const queryGetSearchRecommend = async (val: string) => {
  if (lastRecommendCanceler) {
    lastRecommendCanceler('cancel');
  }

  const cancelToken = new axios.CancelToken((canceler) => {
    lastRecommendCanceler = canceler;
  });

  try {
    const res = await getSearchRecommend(
      {
        query: val,
        lang: locale.value,
      },
      cancelToken
    );
    lastRecommendCanceler = null;
    res.obj.word.forEach((e: SearchRecommendT) => {
      e.keyHtml = e.key.replace(val, `<span class="found">${val}</span>`);
    });

    if (searchValue.value.trim() === val) {
      recommendData.value = res.obj.word;
      showSearchWord.value = recommendData.value.length > 0;
    }
  } catch {
    // nothing
  }
};

const searchRecommendDebounce = (val: string) => {
  clearTimeout(timer);
  timer = setTimeout(() => queryGetSearchRecommend(val), 300);
};

onUnmounted(() => {
  clearTimeout(timer);
  timer = undefined;
});

const onInputValueInput = () => {
  if (searchValue.value.trim()) {
    searchRecommendDebounce(searchValue.value.trim());
  } else {
    recommendData.value = [];
    showSearchWord.value = false;
  }
};

const onClickWordItem = (item: SearchRecommendT) => {
  enterSearchDoc(item.key);
};

const inputRef = ref();
const scrollerRef = ref();
onClickOutside(
  inputRef,
  () => {
    recommendData.value = [];
    showSearchWord.value = false;
  },
  {
    ignore: [scrollerRef],
  }
);

watch(searchValue, () => {
  if (!searchValue.value.trim()) {
    showSearchWord.value = false;
  }
});

const searchInputWidth = ref('100%');

const setSearchInputWidth = () => {
  const homeSearchInput = document.querySelector('.home-search-input') as HTMLElement;
  searchInputWidth.value = homeSearchInput?.offsetWidth ? `${homeSearchInput.offsetWidth}px` : '100%';
};

onMounted(() => {
  setSearchInputWidth();
  window.addEventListener('resize', setSearchInputWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', setSearchInputWidth);
});

// -------------------- banner card --------------------
const bannerCardRatio = computed(() => {
  return (100 / (lePadV.value ? config.value.recommend.columns_mb : config.value.recommend.columns)).toFixed(2);
});

const getBannerCardBg = (item: HomeBannerItemT) => {
  if (isPhone.value) {
    return item[appearanceStore.theme === 'dark' ? 'bg_mb_dark' : 'bg_mb_light'];
  } else {
    return item[appearanceStore.theme === 'dark' ? 'bg_dark' : 'bg_light'];
  }
};
</script>

<template>
  <div class="home" :class="[{ dark: appearanceStore.theme === 'dark' }]">
    <ContentWrapper :vertical-padding="[lePadV ? '24px' : '32px', lePadV ? '24px' : '72px']">
      <!-- banner -->
      <p class="banner-title">{{ t('home.docCenter') }}</p>
      <div class="banner-search">
        <OInput
          ref="inputRef"
          v-model="searchValue"
          :placeholder="t('home.searchPlaceholder')"
          :max-length="100"
          :input-on-outlimit="false"
          class="home-search-input"
          size="large"
          clearable
          @keyup.enter="enterSearchDoc(searchValue)"
          @input="onInputValueInput"
        >
          <template #prefix>
            <OIcon class="icon-search"><IconSearch /></OIcon>
          </template>
        </OInput>

        <OPopup wrapper=".home" :target="inputRef" :visible="showSearchWord" trigger="none" position="bottom">
          <OScroller ref="scrollerRef" class="search-scroller" show-type="hover" size="small" disabled-x>
            <ODropdownItem
              v-for="item in recommendData"
              v-dompurify-html="item.keyHtml"
              :key="item.key"
              :style="{
                '--dropdown-item-color-hover': 'var(--o-color-info2)',
                '--dropdown-item-padding': '8px 12px',
                '--dropdown-item-justify': 'start',
                display: 'block',
                overflow: 'hidden',
                'text-overflow': 'ellipsis',
                'white-space': 'nowrap',
              }"
              @click="onClickWordItem(item)"
            />
          </OScroller>
        </OPopup>

        <div class="hot-search">
          <p class="hot-title">{{ t('home.topSearch') }}</p>
          <ORow gap="16px 0" wrap="wrap">
            <OCol flex="0 0 auto" v-for="(item, i) in config.hots" :key="i">
              <OLink color="primary" :href="getSearchUrl(item)" target="_blank" rel="noopener noreferrer" @click="onClikHotWord">{{ item }}</OLink>
            </OCol>
          </ORow>
        </div>
      </div>

      <!-- banner 卡片 -->
      <div class="banner-card">
        <ORow :gap="gap" wrap="wrap">
          <OCol v-for="(item, i) in config.recommend.items" :key="i" :flex="`0 0 ${bannerCardRatio}%`">
            <HomeBannerCard :title="item.title" :desc="item.desc" :bg="getBannerCardBg(item)" :href="item.href" />
          </OCol>
        </ORow>
      </div>

      <div class="installation-usage-om">
        <div class="installation-section">
          <div class="main-title">{{ config.installation.title }}</div>
          <HomeSectionCard
            class="installation-section-card"
            :title="config.installation.item_title"
            :desc="config.installation.item_desc"
            :desc-max-lines="3"
            :icon="config.installation.item_icon"
            :bg="appearanceStore.theme === 'dark' ? config.installation.item_bg_dark : config.installation.item_bg_light"
            :bg-icon="config.installation.item_bg_icon"
            :href="config.installation.item_href"
          />
        </div>

        <div class="uao-section">
          <div class="main-title">{{ config.usage_and_om.title }}</div>
          <div
            class="uao-section-list"
            :style="{ 'grid-template-columns': `repeat(${lePadV ? config.usage_and_om.columns_mb : config.usage_and_om.columns}, 1fr)` }"
          >
            <HomeSectionCard
              v-for="item in config.usage_and_om.items"
              :key="item.title"
              :title="item.title"
              :desc="item.desc"
              :icon="item.icon"
              :bg-icon="item.bg_icon"
              :href="item.href"
              :show-bg-icon="!lePadV"
            />
          </div>
        </div>
      </div>

      <!-- 其它板块 -->
      <template v-for="item in config.sections" :key="item.title">
        <p class="main-title">{{ item.title }}</p>
        <div class="business-list" :style="{ 'grid-template-columns': `repeat(${lePadV ? item.columns_mb : item.columns}, 1fr)` }">
          <HomeSectionCard v-for="subItem in item.items" :key="subItem.title" :title="subItem.title" :desc="subItem.desc" :href="subItem.href" />
        </div>
      </template>
    </ContentWrapper>

    <ClientOnly>
      <HomeFloat />
    </ClientOnly>
    <HomeFooter />
  </div>
</template>

<style lang="scss" scoped>
.home {
  background-image: url('@/assets/category/home/home-banner.png');
  background-position: top -80px right 50%;
  background-repeat: no-repeat;
  background-size: 100% auto;

  &.dark {
    background-image: url('@/assets/category/home/home-banner-dark.png');
  }

  @include respond-to('<=laptop') {
    background-position: top -66px right 50%;
  }

  @include respond-to('<=pad') {
    background-image: none;
  }
}

.banner-title {
  color: var(--o-color-info1);
  font-weight: 500;
  @include h1;
}

.banner-search {
  margin-top: 16px;

  @include respond-to('<=laptop') {
    margin-top: 12px;
  }
}

.icon-search {
  font-size: 24px;
}

.home-search-input {
  width: 660px;
  --input-height: 40px;
  --input-radius: var(--o-radius-xs);

  @include respond-to('<=pad_v') {
    width: 100%;
  }

  @include respond-to('phone') {
    --input-height: 38px;
    --input-padding: 0 12px;
  }

  :deep(.o_input-suffix) {
    display: none;
  }
}

.hot-search {
  display: flex;
  align-items: flex-start;
  margin-top: 8px;
  color: var(--o-color-info1);
  @include tip1;

  @include respond-to('<=laptop') {
    margin-top: 12px;
  }

  @include respond-to('phone') {
    display: none;
  }
}

.hot-title {
  margin-right: 8px;
  flex-shrink: 0;
  color: var(--o-color-info3);
}

.banner-card {
  margin-top: 32px;

  @include respond-to('<=laptop') {
    margin-top: 24px;
  }

  @include respond-to('<=pad') {
    margin-top: 16px;
  }
}

.main-title {
  color: var(--o-color-info1);
  font-weight: 500;
  margin-top: 40px;
  margin-bottom: 24px;
  @include h2;

  @include respond-to('<=laptop') {
    margin-top: 24px;
    margin-bottom: 16px;
  }

  @include respond-to('<=pad') {
    margin-top: 16px;
    margin-bottom: 12px;
  }
}

.business-list {
  display: grid;
  gap: v-bind(gap);
}

.o-card {
  --card-detail-word-break: normal;
}

.search-scroller {
  width: v-bind(searchInputWidth);
  max-height: 304px;
  padding: 4px;
  border-radius: var(--o-radius-xs);
  background-color: var(--o-color-fill2);

  :deep(.found) {
    color: var(--o-color-primary1);
  }
}

.content-wrapper {
  @include respond-to('laptop') {
    --layout-content-padding: 98px;
  }
}

.installation-usage-om {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: v-bind(gap);

  @include respond-to('<=pad_v') {
    grid-template-columns: repeat(1, 1fr);
    gap: 0;
  }
}

.installation-section {
  grid-column: span 1;
  display: flex;
  flex-direction: column;
}

.installation-section-card {
  flex: 1;
}

.uao-section {
  grid-column: span 3;
}

.uao-section-list {
  display: grid;
  gap: v-bind(gap);
}
</style>
