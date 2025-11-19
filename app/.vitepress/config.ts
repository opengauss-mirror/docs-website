import type Markdown from 'markdown-it';
import type Token from 'markdown-it/lib/token.mjs';

import { getDomId } from './src/utils/common';

export default {
  base: '/',
  assetsDir: '/assets',
  cleanUrls: false,
  ignoreDeadLinks: true,
  appearance: false, // enable dynamic scripts for dark mode
  titleTemplate: true,
  metaChunk: true,
  title: 'openGauss文档 | openGauss社区',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/favicon.ico?v=2',
      },
    ],
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width,initial-scale=1,user-scalable=no',
      },
    ],
    [
      'script',
      {
        src: '/check-dark-mode-v2.js',
      },
    ],
  ],

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh',
      title: 'openGauss文档 | openGauss社区',
      description: 'openGauss文档',
    },
    zh: {
      label: '简体中文',
      lang: 'zh',
      title: 'openGauss文档 | openGauss社区',
      description: 'openGauss文档',
    },
    en: {
      label: 'English',
      lang: 'en',
      title: 'Docs | openGauss',
      description: 'openGauss docs',
    },
  },
  markdown: {
    math: true,
    plantuml: true,
    attrs: {
      disable: true,
    },
    theme: {
      light: 'light-plus',
      dark: 'dark-plus',
    },
    anchor: {
      slugify: (s: string) => `user-content-${getDomId(s)}`,
    },
    config: (md: Markdown) => {
      // 处理须知/说明/警告/注意
      md.core.ruler.before('normalize', 'replace-old-alerts', (state) => {
        const src = state.src
          .replace(/> *!\[\]\(.*?\/icon-note\.gif\) *\**([^\*\n\r]+)\**/g, (_, $1) => {
            return `> [!NOTE]${$1}`;
          })
          .replace(/> *!\[\]\(.*?\/icon-notice\.gif\) *\**([^\*\n\r]+)\**/g, (_, $1) => {
            return `> [!TIP]${$1}`;
          })
          .replace(/> *!\[\]\(.*?\/icon-warning\.gif\) *\**([^\*\n\r]+)\**/g, (_, $1) => {
            return `> [!WARNING]${$1}`;
          })
          .replace(/> *!\[\]\(.*?\/icon-caution\.gif\) *\**([^\*\n\r]+)\**/g, (_, $1) => {
            return `> [!CAUTION]${$1}`;
          });

        state.src = src;
        if (state.env.content) {
          state.env.content = src;
        }
      });

      // 处理资源图片
      md.core.ruler.after('inline', 'fix-image-paths', (state) => {
        if (!state.tokens) return;

        const processTokens = (tokens: Token[]) => {
          tokens.forEach((token) => {
            // 处理 HTML 块和行内元素中的 img 标签
            if ((token.type === 'html_block' || token.type === 'html_inline') && token.content && token.content.includes('<img')) {
              token.content = token.content.replace(/<img([^>]*)src=['"]([^'">]*)['"]([^>]*)>/gi, (match, before, src, after) => {
                // 判断是否为本地地址且没有以 / ./ ../ 开头
                if (src && !src.startsWith('http') && !src.startsWith('https') && !src.startsWith('/') && !src.startsWith('./') && !src.startsWith('../')) {
                  return `<img${before}src="./${src}"${after}>`;
                }
                return match;
              });
            }

            // 递归处理子 tokens
            if (token.children && token.children.length > 0) {
              processTokens(token.children);
            }
          });
        };

        processTokens(state.tokens);
      });

      md.renderer.rules.code_inline = (tokens, idx) => {
        const content = tokens[idx].content;
        // 转义
        const escapedContent = md.utils.escapeHtml(content);
        // 处理双花括号
        return `<code v-pre>${escapedContent}</code>`;
      };

      // 替换 {{ }} 内容
      md.renderer.rules.text = (tokens, idx) => {
        const content = tokens[idx].content;
        const escapedContent = md.utils.escapeHtml(content);
        if (/{{(.*?)}}/g.test(content)) {
          return `<span v-pre>${escapedContent}</span>`;
        }
        return escapedContent;
      };

      // 标题处理
      md.renderer.rules.heading_open = function (tokens, idx, options, _, self) {
        const aIndex = tokens[idx].attrIndex('id');
        const id = tokens[idx].attrs?.[aIndex]?.[1];
        const tag = tokens[idx].tag;
        const render = self.renderToken(tokens, idx, options);
        return `${render}${tag === 'h1' || tag === 'h2' ? `<MarkdownTitle title-id="${id || ''}">` : ''}`;
      };

      md.renderer.rules.heading_close = function (tokens, idx, options, _, self) {
        const tag = tokens[idx].tag;
        return `${tag === 'h1' || tag === 'h2' ? '</MarkdownTitle>' : ''}${self.renderToken(tokens, idx, options)}`;
      };

      // 图片
      const imageRender = md.renderer.rules.image;
      md.renderer.rules.image = (...args) => {
        return `<MarkdownImage>${imageRender!!(...args)}</MarkdownImage>`;
      };

      // 处理文档里写的html标签
      const defaultHtmlBlockRender = md.renderer.rules.html_block;
      md.renderer.rules.html_block = (tokens, idx, options, env, self) => {
        const content = tokens[idx].content;
        tokens[idx].content = tokens[idx].content.replace(/\s+(width|height|class|style|valign|align|headers)=['|"](.*?)['|"]/g, '');
        const renderContent = defaultHtmlBlockRender!!(tokens, idx, options, env, self);
        if (content.includes('<img')) {
          return `<MarkdownImage>${renderContent}</MarkdownImage>`;
        }

        return renderContent;
      };

      const defaultHtmlInlineRender = md.renderer.rules.html_inline;
      md.renderer.rules.html_inline = function (tokens, idx, options, env, self) {
        const content = tokens[idx].content;
        tokens[idx].content = tokens[idx].content.replace(/\s+(width|height|class|style|valign|align|headers)=['|"](.*?)['|"]/g, '');
        const renderContent = defaultHtmlInlineRender!!(tokens, idx, options, env, self);
        if (content.includes('<img')) {
          return `<MarkdownImage>${renderContent}</MarkdownImage>`;
        }

        return renderContent;
      };
    },
  },
};
