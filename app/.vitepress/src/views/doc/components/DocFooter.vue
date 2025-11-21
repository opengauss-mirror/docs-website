<script setup lang="ts">
import { ODivider } from '@opensig/opendesign';

import { linksData2 } from '@/config/footer';
import { getYearByOffset } from '@/utils/common';
import { useLocale } from '@/composables/useLocale';
import { useSearchingStore } from '@/stores/common';

defineProps({
  target: {
    type: String,
    default: '_blank',
  },
});

const baseUrl = import.meta.env.VITE_MAIN_DOMAIN_URL;
const { t, locale } = useLocale();
const searchStore = useSearchingStore();
</script>

<template>
  <div class="app-footer-pc" :class="{ 'is-searching': searchStore.isSearching }">
    <div class="footer-left">
      <div class="second-line">
        <span>{{ t('footer.COPY_RIGHT')!.replace('{year}', String(getYearByOffset())) }}</span>
      </div>
    </div>

    <div class="footer-right">
      <template v-for="(link, index) in linksData2[locale]" :key="link.URL">
        <a :target="target" :href="link.URL.includes('http') ? link.URL : `${baseUrl}${link.URL}`" class="link">{{ link.NAME }}</a>
        <ODivider v-if="index !== linksData2[locale].length - 1" direction="v" />
      </template>
    </div>
  </div>

  <div class="app-footer-mb">
    <div class="links">
      <template v-for="(link, index) in linksData2[locale]" :key="link.URL">
        <a :target="target" :href="link.URL.includes('http') ? link.URL : `${baseUrl}${link.URL}`" class="link">{{ link.NAME }}</a>
        <ODivider v-if="index !== linksData2[locale].length - 1" direction="v" />
      </template>
    </div>

    <div class="copyright">{{ t('footer.COPY_RIGHT')!.replace('{year}', String(getYearByOffset())) }}</div>
  </div>
</template>

<style lang="scss" scoped>
.app-footer-pc {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  margin-top: 12px;
  color: var(--o-color-info3);
  @include tip1;

  @include respond-to('<=pad') {
    display: none;
  }

  @include respond-to('<=laptop') {
    padding: 0 24px;
  }

  @media screen and (max-width: 1600px) {
    font-size: 12px;
    line-height: 18px;
  }

  @media screen and (max-width: 1300px) {
    font-size: 10px;
    line-height: 18px;
  }

  .footer-left {
    display: flex;
    flex-direction: column;
  }

  .second-line {
    display: flex;
    align-items: center;
    margin-top: 2px;
  }

  :deep(.o-divider) {
    --o-divider-bd-color: rgba(var(--o-black), 0.1);
  }

  a {
    color: var(--o-color-info3);

    @include hover {
      color: var(--o-color-link1);
    }
  }
}

.app-footer-pc.is-searching {
  padding: 0;
}

.app-footer-mb {
  display: none;
  margin-top: 16px;
  text-align: center;
  font-size: 10px;
  color: var(--o-color-info4);
  @include tip1;

  @include respond-to('<=pad') {
    display: block;
  }

  @include respond-to('phone') {
    font-size: 10px;
  }

  .copyright {
    margin-top: 4px;
  }

  a {
    color: var(--o-color-info4);

    @include hover {
      color: var(--o-color-link1);
    }
  }
}

@include in-dark {
  .app-footer {
    :deep(.o-divider) {
      --o-divider-bd-color: rgba(var(--o-white), 0.1);
    }
  }
}
</style>
