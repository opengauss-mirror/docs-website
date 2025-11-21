<script setup lang="ts">
import FloatButtonItems from '@/components/float/FloatButtonItems.vue';
import FloatButtonFeedback from '@/components/float/FloatButtonFeedback.vue';
import FloatButtonTop from '@/components/float/FloatButtonTop.vue';
import FloatButtonAnchor from '@/components/float/FloatButtonAnchor.vue';
import FloatButtonItemsDocsMobile from '@/components/float/FloatButtonItemsDocsMobile.vue';

import { useScreen } from '@/composables/useScreen';

const { gtPhone } = useScreen();
</script>

<template>
  <div class="docs-float">
    <template v-if="gtPhone">
      <FloatButtonFeedback />
      <FloatButtonItems source="docs" />
    </template>
    <template v-else>
      <FloatButtonAnchor />
      <FloatButtonItemsDocsMobile />
    </template>
    <FloatButtonTop />
  </div>
</template>

<style lang="scss" scoped>
.docs-float {
  position: fixed;
  bottom: 168px;
  right: 40px;
  z-index: 10;

  @include respond-to('<=pc_s') {
    right: 32px;
  }

  @include respond-to('<=laptop') {
    right: 24px;
  }
}
</style>
