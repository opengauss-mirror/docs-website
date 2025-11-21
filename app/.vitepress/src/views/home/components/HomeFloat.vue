<script setup lang="ts">
import FeedbackMobileDialog from '@/components/float/FeedbackMobileDialog.vue';
import FloatButtonItems from '@/components/float/FloatButtonItems.vue';
import FloatButtonTop from '@/components/float/FloatButtonTop.vue';

import { useScreen } from '@/composables/useScreen';

const { gtPhone } = useScreen();
</script>

<template>
  <div v-if="gtPhone" class="home-float">
    <FloatButtonItems />
    <FloatButtonTop />
  </div>

  <FeedbackMobileDialog v-else />
</template>

<style lang="scss" scoped>
.home-float {
  position: fixed;
  bottom: 168px;
  right: 40px;
  z-index: 10;
  height: 164px;

  @include respond-to('<=pc_s') {
    right: 32px;
  }

  @include respond-to('<=laptop') {
    right: 24px;
  }
}
</style>
