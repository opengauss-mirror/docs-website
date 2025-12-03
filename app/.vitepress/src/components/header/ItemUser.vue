<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useData } from 'vitepress';
import { OIcon, ODropdown, ODropdownItem } from '@opensig/opendesign';
import i18nConfig from '@/i18n';
import { doLogin, doLogout, requestUserInfo } from '@/shared/login';
import { useUserInfoStore } from '@/stores/user';
import IconLogin from '~icons/app/icon-header-person.svg';

const { lang } = useData();
const i18n = computed(() => i18nConfig.global.messages.value[lang.value as 'zh' | 'en']);

// 账号登录
const userInfoStore = useUserInfoStore();
const jumpToUserZone = () => {
  const language = lang.value === 'zh' ? 'zh' : 'en';
  const origin = import.meta.env.VITE_LOGIN_URL;
  window.open(`${origin}/${language}/profile`, '_blank');
};

onMounted(() => {
  requestUserInfo();
});
</script>

<template>
  <div class="header-user">
    <ODropdown v-if="userInfoStore.username" trigger="hover" options-wrapper=".app-header" optionPosition="top" option-wrap-class="user-dropdown">
      <div class="user-info">
        <img v-if="userInfoStore.photo" :src="userInfoStore.photo" class="user-img" />
        <div v-else class="user-img"></div>
        <p class="user-name">{{ userInfoStore.username }}</p>
      </div>
      <template #dropdown>
        <ODropdownItem @click="jumpToUserZone()">
          {{ i18n.common.USER_CENTER }}
        </ODropdownItem>
        <ODropdownItem @click="doLogout()">
          {{ i18n.common.LOGOUT }}
        </ODropdownItem>
      </template>
    </ODropdown>

    <div v-else class="login" @click="doLogin()">
      <OIcon class="icon">
        <IconLogin />
      </OIcon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header-user {
  height: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  @include respond-to('<=pad_v') {
    margin-left: var(--o-gap-2);
  }

  .user-info {
    height: 100%;
    display: flex;
    align-items: center;

    .user-img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      vertical-align: middle;

      @include respond-to('<=pad_v') {
        width: 28px;
        height: 28px;
      }
    }
    .user-name {
      margin-left: 8px;
      width: 72px;
      color: var(--o-color-info1);
      @include text1;
      @include text-truncate(1);

      @include respond-to('<=pad_v') {
        display: none;
      }
    }
  }

  .login {
    width: 24px;
    height: 24px;
    cursor: pointer;
    color: var(--o-color-info1);

    .icon {
      font-size: 24px;
    }

    @include hover {
      color: var(--e-color-brand1);
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
</style>
