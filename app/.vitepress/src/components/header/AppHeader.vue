<script setup lang="ts">
import { computed, ref } from 'vue';
import { useData } from 'vitepress';

import { OLink, OIcon } from '@opensig/opendesign';
import ContentWrapper from '@/components/ContentWrapper.vue';
import ItemNav from './ItemNav.vue';
import ItemLang from './ItemLang.vue';
import ItemTheme from './ItemTheme.vue';
import ItemUser from './ItemUser.vue';
import ItemSearch from './ItemSearch.vue';
import ItemCode from './ItemCode.vue';
import ItemNavMobile from './ItemNavMobile.vue';

import logoLight from '@/assets/category/header/logo.svg';
import logoDark from '@/assets/category/header/logo_dark.svg';
import IconClose from '~icons/app/icon-close.svg';
import IconMenu from '~icons/app/icon-header-menu.svg';

import { useAppearance } from '@/stores/common';
import { useScreen } from '@/composables/useScreen';

const { lang } = useData();
const { lePadV } = useScreen();
const appearanceStore = useAppearance();

// Logo主题判断
const logo = computed(() => (appearanceStore.theme === 'light' ? logoLight : logoDark));

const langShow = ref(['zh', 'en']);

const menuShow = ref(false);

const menuPanel = () => {
  setTimeout(() => {
    menuShow.value = !menuShow.value;
    document.body.style.overflow = menuShow.value ? 'hidden' : '';
  }, 200);
};

const mobileClick = () => {
  menuPanel();
};

// 返回首页
const goHome = () => {
  menuShow.value = false;
  window.location.href = `${import.meta.env.VITE_MAIN_DOMAIN_URL}/${lang.value}/`;
};
</script>

<template>
  <div class="app-header" :class="[{ dark: appearanceStore.theme === 'dark' }]">
    <ContentWrapper class="app-header-wrap">
      <OLink class="logo" @click="goHome">
        <img alt="openGauss logo" :src="logo" />
      </OLink>

      <div v-if="lePadV" class="menu-icon">
        <div class="icon" @click="menuPanel">
          <OIcon>
            <IconMenu v-if="!menuShow" />
            <IconClose v-else />
          </OIcon>
        </div>
      </div>

      <ItemNavMobile v-if="lePadV" :lang-options="langShow" :menuShow="menuShow" @link-click="mobileClick" @close-menu="mobileClick" />

      <ItemNav v-else />
      <div v-if="!lePadV" id="tour_headerNav_tool" class="header-tool">
        <ItemSearch />
        <ItemCode class="gap" />
        <ItemLang class="gap" />
        <ItemTheme class="gap" />
        <ItemUser class="gap" />
      </div>
    </ContentWrapper>
  </div>
</template>

<style lang="scss" scoped>
.app-header {
  background-color: var(--o-color-fill2);
  position: sticky;
  left: 0;
  right: 0;
  top: 0;
  z-index: 98;
  box-shadow: var(--o-shadow-1);
  backdrop-filter: blur(5px);
  height: 72px;

  @include respond-to('laptop') {
    height: 64px;
  }

  @include respond-to('pad_h') {
    height: 56px;
  }

  @include respond-to('<=pad_v') {
    height: 48px;
  }

  @include respond-to('>pad_v') {
    &.dark {
      &:after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 1px;
        background-color: var(--o-color-control4);
      }
    }

    &:before {
      bottom: 0;
      box-shadow: var(--o-shadow-1);
      content: '';
      left: 0;
      pointer-events: none;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 100;
    }
  }
}

.app-header-wrap {
  height: 100%;
  display: flex;
  align-items: center;
  white-space: nowrap;

  .logo {
    height: 100%;
    display: flex;
    align-items: center;
    margin-right: 40px;

    @include respond-to('laptop') {
      margin-right: 24px;
    }

    @include respond-to('pad_h') {
      margin-right: 16px;
    }

    @include respond-to('<=pad_v') {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 0;
      margin-right: 0;
      height: 48px;
    }

    img {
      height: 32px;

      @include respond-to('<=pad_v') {
        height: 20px;
      }
    }
  }

  .gap {
    margin-left: 24px;
    @include respond-to('laptop') {
      margin-left: 16px;
    }
    @include respond-to('pad_h') {
      margin-left: 12px;
    }
  }
}

.header-tool {
  display: flex;
  align-items: center;
  height: 100%;
}

.menu-icon {
  display: block;

  .icon {
    font-size: var(--o-icon_size-m);
    color: var(--o-color-info1);
    height: 24px;
    cursor: pointer;
  }
}

:deep(.user-dropdown) {
  --dropdown-list-radius: var(--o-radius-s);
}

:deep(.o-popup) {
  --popup-shadow: var(--o-shadow2);
  .o-popup-body {
    border: none;
  }
}
</style>
