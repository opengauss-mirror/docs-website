<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { OIcon } from '@opensig/opendesign';

import IconTop from '~icons/app/icon-top.svg';

import { scrollToTop } from '@/utils/common';

const showBackTop = ref(false);
const oscrollerDom = ref();

const onScroll = () => {
  showBackTop.value = oscrollerDom.value.scrollTop > document.body.clientHeight;
};

onMounted(() => {
  oscrollerDom.value = document.querySelector('#app > .o-scroller > .o-scroller-container');
  oscrollerDom.value?.addEventListener('scroll', onScroll);
});

onBeforeUnmount(() => {
  oscrollerDom.value?.removeEventListener('scroll', onScroll);
});

const topTop = () => {
  if (showBackTop.value) {
    scrollToTop(0);
  }
}
</script>

<template>
  <div class="float-btn-top" :class="{ 'float-btn-top-hidden': !showBackTop }"  @click="topTop">
    <OIcon class="icon-top">
      <IconTop />
    </OIcon>
  </div>
</template>

<style lang="scss" scoped>
.float-btn-top {
  display: flex;
  flex-direction: column;
  padding: 12px;
  margin-top: 12px;
  background-color: var(--o-color-fill2);
  border-radius: var(--o-radius-xs);
  box-shadow: var(--o-shadow-2);
  color: var(--o-color-info1);
  cursor: pointer;

  @include respond-to('phone') {
    margin-top: 8px;
  }
}

.float-btn-top-hidden {
  opacity: 0;
  cursor: default;
}

[data-o-theme='dark'] {
  .float-btn-top {
    border: 1px solid var(--o-color-control4-light);
  }
}

.icon-top {
  font-size: var(--o-font_size-h2);
}
</style>
