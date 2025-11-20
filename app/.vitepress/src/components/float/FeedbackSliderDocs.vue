<script setup lang="ts">
import { reactive } from 'vue';
import { OIcon, OLink, useMessage, OButton, ODivider } from '@opensig/opendesign';
import { ElSlider } from 'element-plus';

import IconClose from '~icons/app/icon-close.svg';

import { useScreen } from '@/composables/useScreen';
import { useLocale } from '@/composables/useLocale';
import { postArticleFeedback } from '@/api/api-feedback';

const message = useMessage(null);
const { gtPhone } = useScreen();
const { locale, t } = useLocale();

const emits = defineEmits<{
  (e: 'input', value: boolean): void;
  (e: 'close', value: boolean): void;
}>();

const marks = { 0: '', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: '', 10: '' };

const multiRate = reactive([
  {
    key: 'efficiency',
    name: {
      zh: '文档获取效率',
      en: 'Document retrieval efficiency',
    },
    value: 0,
    isChange: false,
  },
  {
    key: 'accuracy',
    name: {
      zh: '文档正确性',
      en: 'Document accuracy',
    },
    value: 0,
    isChange: false,
  },
  {
    key: 'completeness',
    name: {
      zh: '文档完整性',
      en: 'Document completeness',
    },
    value: 0,
    isChange: false,
  },
  {
    key: 'usability',
    name: {
      zh: '文档易理解',
      en: 'Document comprehensibility',
    },
    value: 0,
    isChange: false,
  },
]);

const closeFeedbackPopup = () => {
  emits('close', false);
};

const showFeedbackInput = () => {
  emits('input', true);
};

const close = () => {
  emits('close', false);
  multiRate.forEach((item) => {
    item.value = 0;
    item.isChange = false;
  });
};

// -------------------- 提交文档评分 --------------------
const submitArticleFeedback = async () => {
  try {
    const res = await postArticleFeedback({
      feedbackPageUrl: window.location.href,
      efficiency: multiRate[0].value,
      accuracy: multiRate[1].value,
      completeness: multiRate[2].value,
      usability: multiRate[3].value,
    });

    if (res.code === 200) {
      message.success({
        content: t('feedback.feedbackSuccess'),
      });

      close();
    } else {
      message.danger({
        content: t('feedback.feedbackSubmitFailed'),
      });
    }
  } catch {
    message.danger({
      content: t('feedback.feedbackSubmitFailed'),
    });
  }
};
</script>

<template>
  <div class="feedback-slider-docs">
    <OIcon v-if="gtPhone" class="icon-close" @click="closeFeedbackPopup"><IconClose /></OIcon>
    <div v-else class="feedback-title">{{ t('feedback.wantSubmitMark') }}</div>

    <template v-for="item in multiRate" :key="item.key">
      <div class="feedback-slider-docs-title">{{ item.name[locale] }}</div>
      <div v-if="!gtPhone" class="rate-stop">
        <div v-for="(_, index) in 11" :key="index" class="stop">{{ index }}</div>
      </div>
      <el-slider
        v-model="item.value"
        size="small"
        :step="1"
        :min="0"
        :max="10"
        :marks="marks"
        show-stops
        show-tooltip
        tooltip-class="feedback-slider-tooltip"
        @input="showFeedbackInput"
        @change="item.isChange = true"
      />
    </template>

    <div v-if="gtPhone" class="feedback-slider-docs-submit">
      <OLink color="primary" :disabled="multiRate.every((item) => !item.isChange)" @click="submitArticleFeedback">{{ t('feedback.submit') }}</OLink>
    </div>
    <div v-else class="btn-box">
      <OButton color="normal" variant="text" size="large" @click="closeFeedbackPopup">{{ t('feedback.cancel') }}</OButton>
      <ODivider class="divider-btn" direction="v" />
      <OButton color="normal" variant="text" size="large" :disabled="multiRate.every((item) => !item.isChange)" @click="submitArticleFeedback">{{
        t('feedback.confirmTitle')
      }}</OButton>
    </div>
  </div>
</template>

<style lang="scss">
.feedback-slider-tooltip {
  --el-text-color-primary: var(--o-color-fill2);
  --el-bg-color: var(--o-color-info1);
  box-shadow: var(--o-shadow-2);
  min-width: 28px;
  height: 25px;
  text-align: center;
  border-radius: var(--o-radius-xs);
  backdrop-filter: blur(5px);

  span {
    display: block;
    margin-top: -4px;
  }

  &::after {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    transform: rotateZ(45deg);
    border-color: transparent var(--o-color-control4-light) var(--o-color-control4-light) transparent;
    background-color: var(--o-color-fill2);
    position: absolute;
    bottom: -4px;
    right: 9px;
    z-index: -1;
  }
}
</style>

<style lang="scss" scoped>
.feedback-slider-docs {
  position: relative;
  color: var(--o-color-info1);
  text-align: center;

  .icon-close {
    position: absolute;
    top: -8px;
    right: -20px;
    color: var(--o-color-info2);
    font-size: 20px;
    cursor: pointer;
    transition: all var(--o-duration-m1) var(--o-easing-standard-in);

    @include hover {
      transform: rotate(180deg);
      color: var(--o-color-primary1);
    }
  }

  .feedback-title {
    font-size: 18px;
    line-height: 26px;
    font-weight: 500;
    margin-bottom: 12px;
  }

  .feedback-slider-docs-title {
    font-size: 12px;
    line-height: 18px;
    margin-bottom: 14px;
    color: var(--o-color-info1);
  }

  :deep(.el-slider) {
    height: 10px;
    margin-bottom: 13px;

    .el-slider__marks {
      display: none;
    }

    .el-slider__runway {
      height: 8px;
      border-radius: var(--o-radius-xs);
      background-color: var(--o-color-control1-light);
    }

    .el-slider__bar {
      height: 10px;
      background-image: linear-gradient(270deg, rgba(125, 50, 234, 1), rgba(196, 159, 252, 1) 100%);
      top: -1px;
      border-radius: 5px;
    }

    .el-slider__button-wrapper + div {
      position: relative;
      transform: translateY(2px);
      z-index: 2;

      & + div {
        transform: translateY(2px);
        & > .el-slider__stop:nth-of-type(1) {
          transform: translatex(2px);
        }
      }
    }

    .el-slider__stop {
      width: 2px;
      height: 2px;
      background-color: var(--o-color-control2);
      top: 1px;
    }

    .el-slider__marks-stop {
      background-color: var(--o-color-fill2);

      &:nth-last-of-type(1) {
        transform: translateX(-4px);
        background-color: var(--o-color-control2);
      }
    }

    .el-slider__button {
      position: relative;
      border: solid 8px var(--o-color-white);
      box-shadow: var(--o-shadow-2);

      &::after {
        display: block;
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: var(--o-color-primary1);
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}

.feedback-slider-docs-submit {
  font-size: 14px;
  line-height: 22px;
}

.btn-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;

  .o-btn {
    --btn-bg-color-hover: none;
    --btn-bg-color-active: none;
    --btn-padding: 0 50px;
    --btn-color: var(--o-color-info1);
    font-weight: 500;
  }
}

.divider-btn {
  height: 24px;
}

.rate-stop {
  display: flex;
  justify-content: space-between;
  margin-left: -1px;
  margin-right: -4px;
  margin-bottom: 6px;
  color: var(--o-color-info4);
  @include tip2;
}
</style>
