<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, watch, type PropType, type Ref } from 'vue';
import { isArray, OMenuItem, OSubMenu, OIcon, OIconChevronDown } from '@opensig/opendesign';

import type { TreeNodeT } from '@/@types/type-tree';
import { refreshSelectedMenuItemPosition } from '@/utils/refresh-ui';

const props = defineProps({
  node: {
    type: Object as PropType<TreeNodeT>,
    required: true,
  },
});

const menuVal = inject<Ref<string>>('menuValue')!;
const getMenuScrollerEl = inject<() => HTMLElement>('getMenuScrollerEl')!;

const itemRef = ref();
const showOffset = computed(() => {
  return isArray(props.node.parent?.children) && props.node.parent.children.some((child) => child.children.length > 0);
});

watch(
  () => menuVal.value,
  () => scrollToItem()
);

const scrollToItem = () => {
  if (menuVal.value !== props.node.id || !itemRef.value?.$el) {
    return;
  }

  const scroller = getMenuScrollerEl();
  if (!scroller) {
    return;
  }

  refreshSelectedMenuItemPosition(itemRef.value.$el, scroller);
};

// -------------------- 阻止点击子内容导致菜单收缩 --------------------
const stopPropagation = (ev: MouseEvent) => ev.stopPropagation();

onMounted(() => {
  if (isArray(props.node.children) && props.node.children.length > 0 && itemRef.value?.$el) {
    const el = itemRef.value.$el.querySelector('.o-sub-menu-children') as HTMLElement;
    if (el) {
      el.addEventListener('click', stopPropagation);
    }
  }

  if (menuVal.value === props.node.id) {
    setTimeout(scrollToItem, 800);
  }
});

onBeforeUnmount(() => {
  if (isArray(props.node.children) && props.node.children.length > 0 && itemRef.value?.$el) {
    const el = itemRef.value.$el.querySelector('.o-sub-menu-children') as HTMLElement;
    if (el) {
      el.removeEventListener('click', stopPropagation);
    }
  }
});
</script>

<template>
  <OSubMenu
    v-if="isArray(node.children) && node.children.length > 0"
    ref="itemRef"
    :class="{ 'doc-sub-menu-page': node.children.length && node.children.every((item) => item.type === 'page') }"
    :value="node.id"
    :title="node.label"
    :selectable="node.type === 'page'"
  >
    <template #title>
      <a v-if="node.href" :href="node.href" class="doc-item-text" @click.prevent>{{ node.label }}</a>
      <span v-else>{{ node.label }}</span>
    </template>
    <DocMenuItem v-for="item in node.children" :key="item.id" :node="item" />
  </OSubMenu>
  <OMenuItem v-else ref="itemRef" :id="node.id" :value="node.id" :title="node.label">
    <a v-if="node.href" :href="node.href" class="doc-item-text" @click.prevent>{{ node.label }}</a>
    <span v-else>{{ node.label }}</span>
  </OMenuItem>
</template>

<style lang="scss" scoped>
.o-menu-item-content {
  width: 100%;
}

.doc-item-text { 
  display: inline-block;
  color: inherit;
}
</style>
