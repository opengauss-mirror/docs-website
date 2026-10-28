import { setCustomCookie } from '@/utils/cookie';
import { defineStore } from 'pinia';

const APPEARANCE_KEY = 'openGauss-theme-appearance';

// 语言
export const useLangStore = defineStore('lang', {
  state: () => {
    return {
      lang: '',
    };
  },
  actions: {
    setLangStore(val: string) {
      this.lang = val;
    },
  },
});

export const useAppearance = defineStore('appearance', {
  state: () => ({
    theme: 'light' as 'light' | 'dark',
    iconMenuShow: true,
  }),
  getters: {
    isDark: (state) => state.theme === 'dark',
  },
  actions: {
    setTheme(theme: 'light' | 'dark') {
      if (this.theme !== theme) {
        this.theme = theme;
      }
      this.sync();
    },
    sync() {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-o-theme', `g.${this.theme}`);
        if (this.theme === 'dark') {
          document.documentElement.classList.remove('light');
        } else if (this.theme === 'light') {
          document.documentElement.classList.remove('dark');
        }
        document.documentElement.classList.add(this.theme);
        setCustomCookie(APPEARANCE_KEY, this.theme, 180, import.meta.env.VITE_COOKIE_DOMAIN);
      }
    }
  }
});

/**
 * 搜索状态
 */
export const useSearchingStore = defineStore('isSearching', {
  state: () => {
    return {
      isSearching: false,
      keyword: '',
      lastSearchValue: '',
      isLoading: false,
      currentPage: 1,
    };
  },
  actions: {
    setIsSearching(value: boolean) {
      this.isSearching = value;
    },
    setKeyword(value: string) {
      this.keyword = value;
    },
    setLastSearchValue(value: string) {
      this.lastSearchValue = value;
    },
    setIsLoading(value: boolean) {
      this.isLoading = value;
    },
    setCurrentPage(value: number) {
      this.currentPage = value;
    },
    clearSearch() {
      this.isLoading = false;
      this.isSearching = false;
      this.lastSearchValue = '';
    },
  },
});

// cookie状态
export const COOKIE_AGREED_STATUS = {
  NOT_SIGNED: '0', // 未签署
  ALL_AGREED: '1', // 同意所有cookie
  NECCESSARY_AGREED: '2', // 仅同意必要cookie
  NOT_SHOW_BUT_AGREED: '3', // 不再显示但已同意
};

// cookie key
export const COOKIE_KEY = 'agreed-cookiepolicy';
export const COOKIE_KEY_ZH = 'agreed-cookiepolicy-zh';
export const COOKIE_KEY_EN = 'agreed-cookiepolicy-en';

/**
 * cookie版本
 */
export const useCookieStore = defineStore('cookie', {
  state: () => ({
    status: '0',
    isNoticeVisible: false,
  }),
});
