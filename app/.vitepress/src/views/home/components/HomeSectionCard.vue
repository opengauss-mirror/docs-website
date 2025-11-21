<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { OIcon, OCard } from '@opensig/opendesign';
import { request } from '@/shared/axios';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
  descMaxLines: {
    type: Number,
    default: 2,
  },
  href: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  bg: {
    type: String,
    default: '',
  },
  showBgIcon: {
    type: Boolean,
    default: true,
  },
  bgIcon: {
    type: String,
    default: '',
  },
});

const svg = ref('');

const getSvg = async () => {
  try {
    const res = await request.get(props.icon);
    svg.value = res.data;
  } catch {
    // nothing
  }
};

onMounted(() => {
  if (props.icon) {
    getSvg();
  }
});
</script>

<template>
  <OCard
    hoverable
    class="section-card"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    :style="{
      'background-image': bg ? `url(${bg})` : '',
    }"
  >
    <template #header>
      <OIcon v-if="svg" class="section-icon" v-dompurify-html="svg" />
      <div class="section-title">{{ title }}</div>
    </template>

    <div class="section-desc" :title="desc">{{ desc }}</div>
    <img v-if="bgIcon && showBgIcon" :src="bgIcon" class="section-bg-icon" />
  </OCard>
</template>

<style lang="scss" scoped>
.section-card {
  --card-main-padding: 24px 32px;
  --card-content-gap: 8px;
  --card-content-text-size: var(--o-font_size-tip1);
  --card-content-text-height: var(--o-line_height-tip1);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  cursor: pointer;

  @include respond-to('<=laptop') {
    --card-main-padding: 16px 24px;
  }

  @include respond-to('<=pad') {
    --card-main-padding: 12px 16px;
    --card-content-text-size: var(--o-font_size-tip2) !important;
    --card-content-text-height: var(--o-line_height-tip2) !important;
  }

  @include respond-to('phone') {
    --card-main-padding: 12px;
  }

  @include hover {
    .section-title {
      color: var(--o-color-primary1);
    }
  }
}

.section-icon {
  font-size: 40px;
  margin-bottom: 8px;

  @include respond-to('<=laptop') {
    font-size: 32px;
  }
}

.section-title {
  color: var(--o-color-info1);
  font-weight: 500;
  @include h4;

  @include respond-to('<=laptop') {
    margin-top: 0;
  }
}

.section-bg-icon {
  position: absolute;
  right: -16px;
  bottom: -16px;
  width: 80px;
  opacity: 0.05;

  @include respond-to('<=laptop') {
    right: -12px;
    bottom: -12px;
    width: 60px;
  }

  @include respond-to('<=pad') {
    right: -8px;
    bottom: -8px;
    width: 50px;
  }
}

.section-desc {
  @include text-truncate(v-bind(descMaxLines));
}
</style>
