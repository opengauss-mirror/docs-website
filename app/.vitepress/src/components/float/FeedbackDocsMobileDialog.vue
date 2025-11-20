<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { ODialog } from '@opensig/opendesign';

import FeedbackSliderDocs from './FeedbackSliderDocs.vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['update:visible']);
const showDlg = useVModel(props, 'visible', emits);
</script>

<template>
  <ODialog
    v-model:visible="showDlg"
    :phone-half-full="true"
    :style="{ '--dlg-edge-gap': '16px 24px', '--dlg-body-padding': '24px 24px 16px', '--dlg-radius': '4px 4px 0 0' }"
    :scroller="false"
    main-class="feedback-docs-mb-dlg disable-scroller"
  >
    <FeedbackSliderDocs @close="showDlg = false" />
  </ODialog>
</template>
