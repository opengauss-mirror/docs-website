import { computed } from 'vue';
import { useData } from 'vitepress';
import { defineStore } from 'pinia';

export const useVersionStore = defineStore('version', () => {
  const { page } = useData();

  // 当前版本
  const version = computed(() => {
    return page.value.filePath.split('/')[2] || '';
  });

  // 前缀版本，如 7.0.0-RC2-lite 的前缀版本为 7.0.0-RC2
  const prefixVersion = computed(() => {
    return version.value.replace('-lite', '');
  });

  // 是否为轻量版
  const isLite = computed(() => {
    return version.value.includes('-lite');
  });

  return {
    version,
    prefixVersion,
    isLite,
  };
});
