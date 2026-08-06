<script setup lang="ts">
import { ref, computed, markRaw, type PropType } from 'vue';
import { OIcon, OPopup, ODivider, OLink } from '@opensig/opendesign';
import { OFeedbackDoc } from '@opendesign-plus/components';

import IconHeadset from '~icons/feedback/icon-headset.svg';
import IconFAQ from '~icons/feedback/icon-faq.svg';
import IconForum from '~icons/feedback/icon-forum.svg';

import FeedbackSliderPopup from '@/components/float/FeedbackSliderPopup.vue';

import { useLocale } from '@/composables/useLocale';
import { useAppearance } from '@/stores/common';
import { useFeedbackDocStore } from '@/stores/feedback';

defineProps({
  source: {
    type: String as PropType<'home' | 'docs'>,
    default: 'home',
  },
});

const { t, locale } = useLocale();
const feedbackDocStore = useFeedbackDocStore();

const isDark = computed(() => {
  return useAppearance().theme === 'dark' ? true : false;
});

// -------------------- 文档反馈 --------------------
const issuebackRef = ref();

const floatData = ref([
  {
    visibility: true,
    img: markRaw(IconForum as unknown as object),
    id: 'forum',
    text: computed(() => t('feedback.forum')),
    textMb: computed(() => t('feedback.forumHelp')),
    tip: computed(() => t('feedback.forumTip')),
    link: import.meta.env.VITE_SERVICE_FORUM_URL,
  },
  {
    visibility: computed(() => locale.value === 'zh'),
    img: markRaw(IconFAQ as unknown as object),
    id: 'faq',
    text: computed(() => t('feedback.faq')),
    tip: '',
    link: `/${locale.value}/docs/common/faq/faq.html`,
  },
]);
</script>

<template>
  <div class="nav-box" :class="isDark ? 'dark-nav' : ''">
    <FeedbackSliderPopup v-if="source === 'home'" />
    <OFeedbackDoc
      v-else
      v-model:efficiency="feedbackDocStore.efficiency"
      v-model:accuracy="feedbackDocStore.accuracy"
      v-model:completeness="feedbackDocStore.completeness"
      v-model:usability="feedbackDocStore.usability"
      v-model:feedback="feedbackDocStore.feedback"
      :submit-data="feedbackDocStore.submitRate"
      :submit-issue="feedbackDocStore.submitIssue"
      @close="feedbackDocStore.reset"
    />

    <ODivider :style="{ '--o-divider-gap': '12px' }" />

    <div class="nav-item">
      <OIcon ref="issuebackRef" id="issueback">
        <IconHeadset />
      </OIcon>

      <OPopup
        position="left"
        :target="issuebackRef"
        wrapper="#issueback"
        :body-class="`popup-issueback ${locale === 'en' ? 'popup-issueback-en' : ''}`"
        :offset="24"
        trigger="hover"
        :style="{
          top: '-8px',
        }"
      >
        <template v-for="item in floatData" :key="item.id">
          <OLink v-if="item.visibility" :href="item.link" target="_blank" :hover-underline="false" class="popup-item">
            <OIcon><component :is="item.img"></component> </OIcon>

            <div class="text">
              <p class="text-name">
                {{ item.text }}
              </p>

              <p v-if="item.tip" class="text-tip">{{ item.tip }}</p>
            </div>
          </OLink>
        </template>
      </OPopup>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.o-icon {
  font-size: 24px;
}
.nav-box {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 16px 12px;
  background-color: var(--o-color-fill2);
  border-radius: var(--o-radius-xs);
  box-shadow: var(--o-shadow-2);
}
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--o-color-info1);
  cursor: pointer;

  @include hover {
    color: var(--o-color-primary1);
  }
}

:deep(.o-link-label) {
  display: flex;
  flex-direction: column;
  align-items: center;
}

:deep(.o-popup) {
  cursor: default;

  .popup-item {
    .o-icon {
      font-size: var(--o-font_size-h1);
      color: var(--o-color-info1);
    }
  }

  .popup-issueback {
    padding: 24px;
    background-color: var(--o-color-fill2);
    border-radius: var(--o-radius-xs);
    width: 224px;
    position: relative;
    display: flex;
    flex-direction: column;

    .popup-item {
      padding: 0;

      .o-link-main {
        display: flex;
        align-items: flex-start;
        color: var(--o-color-info1);
      }

      @include hover {
        & .text .text-name {
          color: var(--o-color-primary1);
        }
      }

      & ~ .popup-item {
        margin-top: 12px;
      }

      .text {
        margin-left: 8px;
        text-align: left;
        align-self: center;

        .text-name {
          font-size: var(--o-font_size-tip1);
          line-height: 22px;
          font-weight: 600;
          a {
            color: var(--o-color-info1);
          }
        }
        .text-tip {
          font-size: var(--o-font_size-tip2);
          line-height: 18px;
          color: var(--o-color-info2);
          margin-top: 4px;
        }
      }
    }
  }

  .popup-issueback-en {
    width: 260px;
  }
}
</style>
