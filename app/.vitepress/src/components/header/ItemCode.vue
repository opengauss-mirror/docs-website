<script lang="ts" setup>
import { computed } from 'vue';
import { OIcon, ODropdown, ODropdownItem } from '@opensig/opendesign';

import IconChevronDown from '~icons/app/icon-chevron-down.svg';

import i18n from '@/i18n';
import { useLocale } from '@/composables/useLocale';

const { locale, t } = useLocale();
const sourceCode = computed(() => i18n.global.messages.value[locale.value].header.SOURCE_CODE);

const itemChange = (data: any) => {
  window.open(data.PATH, '_blank');
};
</script>

<template>
  <div class="header-code">
    <ODropdown trigger="hover" options-wrapper=".header-code" option-position="top" option-wrap-class="lang-dropdown">
      <div class="info-wrap hover-icon-rotate">
        <span class="title">{{ t('header.CODE') }}</span>
        <OIcon class="icon"><IconChevronDown /></OIcon>
      </div>

      <template #dropdown>
        <ODropdownItem v-for="item in sourceCode" @click="itemChange(item)" :key="item.PATH" class="list">
          {{ item.NAME }}
          <OIcon v-if="item.ICON">
            <component :is="item.ICON" class="icon" />
          </OIcon>
        </ODropdownItem>
      </template>
    </ODropdown>
  </div>
</template>

<style lang="scss" scoped>
.icon {
  font-size: var(--o-icon_size_control-xs);
  margin-left: var(--o-gap-1);
}

.header-code {
  height: 100%;
  display: flex;
  align-items: center;

  .info-wrap {
    height: 100%;
    display: flex;
    align-items: center;
    color: var(--o-color-info1);
    cursor: pointer;

    &:hover {
      color: var(--o-color-primary1);
    }

    .title {
      display: flex;
      align-items: center;
      cursor: pointer;
      height: 100%;
      @include tip1;
    }
  }

  .list {
    cursor: pointer;
    border-radius: var(--o-radius_control-xs);
    padding: var(--o-gap-2) var(--o-gap-4);
    width: 136px;
  }
}

.hover-icon-rotate {
  .o-icon {
    transition: all var(--o-duration-m1) var(--o-easing-standard-in);
  }

  @include hover {
    .o-icon {
      transform: rotate(-180deg);
    }
  }
}

.o-dropdown {
  height: 100%;
}

.o-dropdown-item {
  background: var(--o-color-fill2);
  cursor: pointer;
  border-radius: var(--o-radius_control-xs);
  padding: var(--o-gap-1);
  min-width: 144px;
  height: 40px;

  @include hover {
    color: var(--o-color-primary1);
    background: var(--o-color-control2-light);
  }
}
:deep(.lang-dropdown) {
  --dropdown-list-radius: var(--o-radius-s);
}
</style>
