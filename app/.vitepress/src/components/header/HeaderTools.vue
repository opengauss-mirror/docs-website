<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { OHeaderLanguageSwitcher, OHeaderSourceCode, OHeaderTheme, OHeaderUser } from '@opendesign-plus/components';
import { getUserAuth, useLoginStore } from '@opendesign-plus/composables';
import ItemSearch from './ItemSearch.vue';
import headerData from '@/config/header';
import { useAppearance } from '@/stores/common';
import { useUserInfoStore } from '@/stores/user';
import { doLogin, doLogout, requestUserInfo } from '@/shared/login';
import { useData, useRouter } from 'vitepress';
import { useLocale } from '@/composables/useLocale';
import { isPageExist } from '@/api/api-common';
import { getUnreadMsgCount } from '@/api/api-user';
import { useI18n } from '@/i18n';
import { useScreen } from '@/composables/useScreen';
import { getCustomCookie } from '@/utils/cookie';
import { usePreferredColorScheme } from '@vueuse/core';

const i18n = useI18n();
const { locale } = useLocale();
const commonStore = useAppearance();
const { gtPadV } = useScreen();
const { lang } = useData();
const router = useRouter();

const changeTheme = (val: 'light' | 'dark') => commonStore.setTheme(val);
const preferredColor = usePreferredColorScheme();

const changeLanguage: (arg: { id: string }) => void = async ({ id }) => {
  if (locale.value === id) {
    return;
  }

  const { pathname, search } = window.location;
  const newHref = pathname.replace(`/${locale.value}/`, `/${id}/`);
  if (await isPageExist(newHref)) {
    router.go(newHref + search);
  } else {
    window.location.href = `/${id}/`;
  }
};

const userOptions = computed(() => headerData.userOptions[lang.value as 'zh' | 'en']);

// ============登录信息============
const token = ref('');
const loginStore = useLoginStore();
const unreadMsgCount = ref(0);
const userStore = useUserInfoStore();

const userInfo = computed(() => ({
  email: userStore.email,
  photo: userStore.photo,
  username: userStore.username,
}));

onMounted(() => {
  const defaultTheme = (getCustomCookie('openGauss-theme-appearance') || (preferredColor.value === 'no-preference' ? 'light' : preferredColor.value) || 'light') as 'light' | 'dark';
  if (defaultTheme !== commonStore.theme) {
    commonStore.setTheme(defaultTheme);
  }

  requestUserInfo();
  const { csrfCookie } = getUserAuth();
  token.value = csrfCookie || '';
});

watch(
  () => loginStore.isLogined,
  async (val) => {
    if (!val) {
      unreadMsgCount.value = 0;
      return;
    }
    const giteeLoginName = userStore.identities?.find((item) => item.identity === 'gitee')?.login_name;
    if (giteeLoginName) {
      const data = await getUnreadMsgCount(giteeLoginName, token.value);
      unreadMsgCount.value = Object.values(data).reduce((count, val) => count + val, 0);
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="header-tool">
    <ItemSearch />
    <template v-if="gtPadV">
      <!-- 源码 -->
      <OHeaderSourceCode :title="i18n.header.CODE" :options="headerData.sourceCode" justify="flex-start" />
      <!-- 语言 -->
      <OHeaderLanguageSwitcher :options="headerData.langOptions" type="common" @change="changeLanguage" />
      <!-- 皮肤 -->
      <OHeaderTheme type="common" :theme="commonStore.theme" @change="changeTheme" />
    </template>
    <!-- 用户信息 -->
    <div class="login">
      <OHeaderUser
        :token="token"
        :lang="lang"
        :noticeTotal="unreadMsgCount"
        :userInfo="userInfo"
        :options="userOptions"
        :custom-size="20"
        :simple="!gtPadV"
        @login="doLogin()"
        @logout="doLogout()"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header-tool {
  display: flex;
  align-items: center;
  height: 100%;
  --header-tool-gap: 20px;
  @include respond-to('laptop') {
    --header-tool-gap: 16px;
  }
  @include respond-to('pad_h') {
    --header-tool-gap: 12px;
  }
  .source-code {
    margin-left: var(--header-tool-gap);
  }
  .header-lang {
    margin-left: var(--header-tool-gap);
  }
  .o-theme-switcher {
    margin-left: var(--header-tool-gap);
  }
  .login {
    height: 100%;
    display: flex;
    align-items: center;
    margin-left: var(--header-tool-gap);
    .o-icon {
      --icon-size: 24px;
    }
    :deep(.info-wrap) {
      margin: 5px 0 !important;
    }
  }
}
</style>
