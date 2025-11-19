<script setup lang="ts">
import { OResult, OButton } from '@opensig/opendesign';

import notFoundImage from '@/assets/category/illustrations/404.png';
import notFoundImageDark from '@/assets/category/illustrations/404-dark.png';

import { useAppearance } from '@/stores/common';
import { useLocale } from '@/composables/useLocale';

const { t, locale } = useLocale();
const appearanceStore = useAppearance();
</script>

<template>
  <ContentWrapper class="result-404">
    <OResult>
      <template #image>
        <slot name="image">
          <img alt="notFound" :src="appearanceStore.theme === 'dark' ? notFoundImageDark : notFoundImage" />
        </slot>
      </template>
      <template #extra>
        <p class="text404">{{ t('common.empty') }}</p>
        <a :href="`/${locale}/`" target="_self" rel="noopener">
          <OButton variant="solid" color="primary">{{ t('common.returnHome') }}</OButton>
        </a>
      </template>
    </OResult>
  </ContentWrapper>
</template>

<style lang="scss" scoped>
.result-404 {
  width: 100%;
  height: var(--layout-content-min-height);
  display: flex;
  justify-content: center;
  align-items: center;

  :deep(.o-result-image) {
    --result-image-height: auto;
  }
}

.text404 {
  @include text2;
  color: var(--o-color-info1);
  margin-bottom: 24px;
}
</style>
