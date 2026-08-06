<script setup lang="ts">
import { ref } from 'vue';
import { OIcon, OPopup } from '@opensig/opendesign';

import FeedbackSlider from '@/components/float/FeedbackSlider.vue';
import IconSmile from '~icons/app/icon-smile.svg';

const feedbackRef = ref();
const showPopup = ref(false); 
const autoHide = ref(true); 

let timer: NodeJS.Timeout;

// 鼠标进入图标区域
const onMouseEnter = () => {
  clearTimeout(timer);
  showPopup.value = true;
};

// 鼠标离开图标区域
const onMouseLeave = () => {
  if (!autoHide.value) {
    return;
  }

  clearTimeout(timer);
  timer = setTimeout(() => {
    showPopup.value = false;
  }, 300);
};

// 关闭弹窗
const onClose = () => {
  showPopup.value = false;
  autoHide.value = true;
};

// 评分改变
const onChange = () => {
  autoHide.value = false;
}
</script>

<template>
  <div class="feedback-slider-wrap" id="feedback-slider-wrap" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <OIcon ref="feedbackRef" class="icon-smile">
      <IconSmile />
    </OIcon>

    <OPopup
      :visible="showPopup"
      :target="feedbackRef"
      :auto-hide="autoHide"
      :offset="24"
      position="lt"
      wrapper="#feedback-slider-wrap"
      body-class="feedback-slider-popup-body"
      trigger="hover"
      :style="{
        top: '-14px',
      }"
    >
      <FeedbackSlider @close="onClose" @change="onChange" />
    </OPopup>
  </div>
</template>

<style lang="scss" scoped>
.feedback-slider-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--o-color-info1);
  cursor: pointer;

  @include hover {
    color: var(--o-color-primary1);
  }

  .icon-smile {
    font-size: 24px;
  }
}

:deep(.o-popup) {
  cursor: default;

  .feedback-slider-popup-body {
    width: 360px;
    padding: 16px 30px;
    background-color: var(--o-color-fill2);
    border-radius: var(--o-radius-xs);
  }
}
</style>
