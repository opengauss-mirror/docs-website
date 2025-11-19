import { computed, shallowReadonly } from 'vue';
import { useData } from 'vitepress';
import { defineStore } from 'pinia';
import { isClient } from '@opensig/opendesign';

import { TOC_CONFIG, TOC_EN_CONFIG } from '@/config/toc';
import { createTree, findNode, findPrevNode, getPrevNodes } from '@/utils/tree';

export const useNodeStore = defineStore('node', () => {
  const root = shallowReadonly(createTree([...TOC_CONFIG, ...TOC_EN_CONFIG]));
  const { page } = useData();

  // 页面路径
  const pathname = computed(() => {
    return `/${page.value.filePath.replace('.md', '.html')}`;
  });

  // 页面节点
  const pageNode = computed(() => {
    if (isClient && window.location.search) {
      const node = findNode(root, 'href', `${pathname.value}${decodeURIComponent(window.location.search)}`);
      if (node) {
        return node;
      }
    }

    return root ? findNode(root, 'href', pathname.value) : null;
  });

  // 当前节点（当前菜单不包含锚点，currentNode 等于 pageNode）
  const currentNode = pageNode;

  // 手册节点
  const manualNode = computed(() => {
    return pageNode.value ? findPrevNode(pageNode.value, 'isManual', true) : null;
  });

  // 符合当前版本的所有节点
  const versionNodes = computed(() => {
    return pageNode.value ? (findPrevNode(pageNode.value, 'type', 'docs-version-root') || findPrevNode(pageNode.value, 'type', 'docs-single-manual-root') ): null;
  });

  // 所有前驱节点
  const prevNodes = computed(() => {
    return currentNode.value ? getPrevNodes(currentNode.value, 2) : [];
  });

  return {
    root, // 根节点
    versionNodes, // 当前版本内容根节点
    manualNode, // 手册节点
    currentNode, // 当前节点
    pageNode, // 页面节点
    prevNodes, // 所有前驱节点
  };
});
