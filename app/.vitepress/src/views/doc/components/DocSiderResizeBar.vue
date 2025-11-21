<script setup lang="ts">
import { ref } from 'vue';

import { useViewStore } from '@/stores/view';
import { useScreen } from '@/composables/useScreen';

const { leLaptop } = useScreen();
const viewStore = useViewStore();
const dragging = ref(false);
const hover = ref(false);
const hoverY = ref(0);

let startX = 0;
const onMouseDown = (e: MouseEvent) => {
  startX = e.clientX;
  // 设置全局拖拽指针和不可选中文本
  document.body.style.cursor = 'ew-resize';
  document.body.style.userSelect = 'none';
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseEnd);
  dragging.value = true;
};

const onMouseMove = (e: MouseEvent) => {
  const width = viewStore.siderWidth + (e.clientX - startX);
  if (width > 272 && width < 600) {
    startX = e.clientX;
    viewStore.siderWidth = width;
  }
};

const onMouseEnd = () => {
  // 恢复原本的样式
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseEnd);
  dragging.value = false;
};

const onMouseEnter = (e: MouseEvent) => {
  if (!hover.value && !dragging.value) {
    hoverY.value = e.clientY - (leLaptop.value ? 108 : 116);
  }
  hover.value = true;
};

const onMouseLeave = () => {
  hover.value = false;
};
</script>

<template>
  <div class="doc-sider-resize-bar" @mousedown="onMouseDown" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <div class="drag-line"></div>
  </div>
</template>

<style lang="scss" scoped>
.doc-sider-resize-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  right: calc(-1 * var(--layout-doc-menu-gap));
  width: var(--layout-doc-menu-gap);
  background: transparent;
  cursor: ew-resize;

  @include respond-to('<=pad') {
    display: none;
  }
}

.drag-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc((var(--layout-doc-menu-gap) / 2));
  width: 1px;
  background: var(--o-color-control4);
}

</style>
