<script setup lang="ts">
import { ref } from 'vue';

import FeedbackPrIssue from './FeedbackPrIssue.vue';

import { useLocale } from '@/composables/useLocale';

const { t } = useLocale();
const feedbackRef = ref<HTMLElement>();
</script>

<template>
  <FeedbackPrIssue>
    <div ref="feedbackRef" class="feedback-box">
      <div class="feedback-text">{{ t('feedback.bugCatching') }}</div>
    </div>
  </FeedbackPrIssue>
</template>

<style lang="scss" scoped>
.feedback-box {
  width: 100%;
  height: 104px;
  background-image: url(@/assets/category/feedback/feedback-bg.png);
  background-size: 100%;
  margin-bottom: 12px;
  box-shadow: var(--e-shadow-l2);
  user-select: none;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  letter-spacing: 4px;
  cursor: pointer;
}

.feedback-box:hover {
  background-image: url(@/assets/category/feedback/feedback-bg-hover.png);
}

.feedback-text {
  color: white;
  font-size: 14px;
  writing-mode: vertical-rl;
}

[lang='en'] {
  .feedback-text {
    writing-mode: inherit;
    white-space: pre;
  }
}
</style>
