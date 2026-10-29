<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { useRouter } from 'vitepress';
import { OHeaderLanguageSwitcher, OHeaderMobile, OHeaderTheme } from '@opendesign-plus/components';
import { OHeader } from '@opendesign-plus/components';
import HeaderTools from './HeaderTools.vue';

import logoLight from '@/assets/category/header/logo.svg';
import logoDark from '@/assets/category/header/logo_dark.svg';

import { useAppearance } from '@/stores/common';
import { useScreen } from '@/composables/useScreen';
import headerData from '@/config/header';
import { useElementSize } from '@vueuse/core';
import { useLocale } from '@/composables/useLocale';
import { isPageExist } from '@/api/api-common.js';

const { locale } = useLocale();
const { lePadV } = useScreen();
const appearanceStore = useAppearance();
const router = useRouter();

const navData = computed(() => headerData.nav[locale.value as 'zh' | 'en']);

const changeTheme = (val: 'light' | 'dark') => appearanceStore.setTheme(val);
const changeLanguage: (arg: { id: string }) => void = async ({ id }) => {
  if (locale.value === id) {
    return;
  }

  const { pathname, search } = window.location;
  const newHref = pathname.replace(`/${locale.value}/`, `/${id}/`);
  if (await isPageExist(newHref)) {
    router.go(newHref + search);
  } else {
    window.location.href = `/${id}/`;
  }
};

// Logo主题判断
const logo = computed(() => (appearanceStore.theme === 'light' ? logoLight : logoDark));

const goHome = () => window.location.href = `${import.meta.env.VITE_MAIN_DOMAIN_URL}/${locale.value}/`;

const headerRef = useTemplateRef('headerRef');
const headerMobileRef = useTemplateRef('headerMobileRef');
const headerWrap = computed(() => {
  const activeHeader = lePadV.value ? headerMobileRef.value : headerRef.value;
  return activeHeader?.$el.querySelector('.header-wrap');
});

const { height } = useElementSize(headerWrap);

defineExpose({ 
  height
});
</script>

<template>
  <OHeaderMobile v-if="lePadV" ref="headerMobileRef" active-index="document" :logo="logo" :nav-data="navData">
    <template #toolbar>
      <HeaderTools />
    </template>
    <template #tool>
      <!-- 语言 -->
      <OHeaderLanguageSwitcher :options="headerData.langOptions" type="mobile" @change="changeLanguage" />
      <!-- 皮肤 -->
      <OHeaderTheme type="mobile" :theme="appearanceStore.theme" @change="changeTheme" />
    </template>
  </OHeaderMobile>
  <OHeader v-else ref="headerRef" community="openGauss" :logo="logo" :nav-data="navData" active-index="document" @go-home="goHome">
    <template #toolbar>
      <HeaderTools />
    </template>
  </OHeader>
</template>

<style lang="scss" scoped>
:deep(.header .other-tool .o-theme-switcher) {
  margin-top: 24px;
}

:deep(.header-simple .header-title) {
  font-size: 18px !important;
  line-height: 26px !important;
}

:deep(.opengauss.nav-content) {
  --sub-gap: 24px;
  @include respond-to('<=laptop') {
    --sub-gap: 16px;
  }
}

@mixin grid-header-nav-layout($container-cols: 2) {
  .item-sub {
    flex: 1;
    .content-container {
      display: grid;
      grid-template-columns: repeat($container-cols, 1fr);
      gap: var(--sub-gap);
    }
    .content-item {
      width: 100% !important;
    }
    &:not(:first-child) {
      margin-left: var(--sub-gap);
    }
  }
}

// 下载
:deep(.opengauss.nav-content.download) {
  @include grid-header-nav-layout();
}

// 开发
:deep(.opengauss.nav-content.development) {
  @include grid-header-nav-layout(4);
}

// 文档
:deep(.opengauss.nav-content.document) {
  @include grid-header-nav-layout(4);
}

// 学习
:deep(.opengauss.nav-content.learn) {
  @include grid-header-nav-layout();
}

// 支持
:deep(.opengauss.nav-content.approve) {
  @include grid-header-nav-layout(1);
}

// 社区
:deep(.opengauss.nav-content.community) {
  @include grid-header-nav-layout();
}

// 动态
:deep(.opengauss.nav-content.update) {
  @include grid-header-nav-layout();
}

:deep(.opengauss.nav-content .content-item) {
  margin: 0;
}

.header-tool {
  display: flex;
  align-items: center;
  height: 100%;
  .source-code {
    margin-left: var(--header-tool-gap);
  }
  .header-lang {
    margin-left: var(--header-tool-gap);
  }
  .o-theme-switcher {
    margin-left: var(--header-tool-gap);
  }
  .login {
    height: 100%;
    display: flex;
    align-items: center;
    margin-left: var(--header-tool-gap);
    .o-icon {
      --icon-size: 24px;
    }
    :deep(.info-wrap) {
      margin: 5px 0 !important;
    }
  }
}
</style>
