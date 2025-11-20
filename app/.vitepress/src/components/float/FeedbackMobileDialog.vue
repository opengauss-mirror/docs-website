<script setup lang="ts">
import { ref } from 'vue';
import { OIcon, ODialog } from '@opensig/opendesign';

import FeedbackSlider from './FeedbackSlider.vue';

import IconClose from '~icons/app/icon-close.svg';

import { useScreen } from '@/composables/useScreen';
import { useLocale } from '@/composables/useLocale';

const { isPhone } = useScreen();
const { t } = useLocale();

const feedbackMbRef = ref();
const isShow = ref(false);
const showDlg = ref(false);
const isShowFeedbackMb = ref(true);

const closeFeedbackMb = () => {
  isShowFeedbackMb.value = false;
};
</script>

<template>
  <div v-if="isPhone && isShowFeedbackMb" class="feedback-mb">
    <div ref="feedbackMbRef" class="feedback-mb-head">
      <div class="head-title" @click="showDlg = true">
        <p>
          {{ t('feedback.title1') }}<span class="title-name">{{ t('feedback.title2') }}</span
          >{{ t('feedback.title3') }}
        </p>
      </div>
      <OIcon class="icon-close" @click.stop="closeFeedbackMb">
        <IconClose />
      </OIcon>
    </div>

    <ODialog
      v-model:visible="showDlg"
      :phone-half-full="true"
      :style="{ '--dlg-edge-gap': '16px 24px', '--dlg-body-padding': '24px 24px 16px', '--dlg-radius': '4px 4px 0 0' }"
      :scroller="false"
      main-class="feedback-mb-dlg disable-scroller"
    >
      <FeedbackSlider :show="isShow" @close="showDlg = false" />
    </ODialog>
  </div>
</template>

<style lang="scss" scoped>
.feedback-mb {
  position: sticky;
  bottom: 16px;
  z-index: 11;
  width: 100%;
  margin-bottom: 16px;
  padding: 0 24px;
}

.feedback-mb-head {
  height: 40px;
  padding: 10px 12px;
  background: linear-gradient(270deg, rgba(221, 207, 245, 1), rgba(232, 216, 247, 1) 100%);
  border-radius: var(--o-radius-xs);
  display: flex;
  align-items: center;
  position: relative;
  box-shadow: var(--o-shadow-1);
  color: var(--o-color-black);

  .icon-close {
    position: absolute;
    right: 12px;
    top: 50%;
    font-size: 16px;
    cursor: pointer;
    transform: translateY(-50%);
    transition: all 0.25s cubic-bezier(0, 0, 0, 1);

    @include hover {
      transform: translateY(-50%) rotate(180deg);
      color: var(--o-color-primary1);
    }
  }

  .head-title {
    flex: 1;
    display: flex;
    align-items: center;
    white-space: nowrap;
    @include text1;

    .title-name {
      font-weight: 600;
    }
  }
}
</style>
