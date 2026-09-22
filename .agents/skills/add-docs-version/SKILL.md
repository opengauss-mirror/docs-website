---
name: add-docs-version
description: 为 openGauss 文档网站添加新的文档版本，自动更新相关配置文件
---

# add-docs-version

## 使用场景

当需要为 openGauss 文档网站添加新的文档版本时触发

- 添加文档版本
- 更新版本配置
- 配置nginx代理
- 版本发布

## 执行步骤

### 1. 获取版本信息

从用户输入中获取新的版本号。若用户未提供，询问用户。

openGauss 版本号格式示例：`7.0.0-RC3`、`6.0.0`、`5.1.0` 等

### 2. 更新版本配置文件

修改 `app/.vitepress/src/config/version.ts` 文件：

1. 在 `zh` 数组中添加新的版本对象，添加在 `latest` 之后的第一个位置（即第二个对象）
2. 在 `en` 数组中添加新的版本对象，同样添加在 `latest` 之后的第一个位置

版本对象格式（参考 `7.0.0-RC3` 的写法，`link` 表示企业版/lite 版本）：

```typescript
{
  label: '版本号 (RC)',
  value: '版本号',
  link: {
    enterprise: '/zh/docs/版本号/release_notes/release_notes.html',
    lite: '/zh/docs/版本号-lite/release_notes/release_notes.html',
  }
}
```

注意：

- 对象中的 `label` 需要带上发布类型后缀，如 `(DEV)`、`(RC)`、`(LTS)`、`(Preview)`
- 若版本没有 lite 文档，则使用 `href` 字段代替 `link` 字段，如 `href: '/zh/docs/版本号/docs/GettingStarted/GettingStarted.html'`
- 若为停止维护（EOM）版本，需要添加 `archive: true`
- 英文版本（`en` 数组）与中文版本路径结构一致，只需把 `/zh/` 替换为 `/en/`

### 3. 更新脚本配置文件（严格遵守）

修改 `scripts/config/version.js` 文件中的 `VITEPRESS_VERSIONS_CONFIG` 配置：

1. **不要**修改 `HUGO_VERSIONS_CONFIG` 配置
2. **不要**修改 `VITEPRESS_VERSIONS_CONFIG` 中**已添加**的 key 和 value，如 `common`、`master` 的内容
3. 在 `VITEPRESS_VERSIONS_CONFIG` 的 `master: 'latest'` 后添加**新的**版本映射关系，格式为：`'文档分支名': '版本号'`

该配置的含义是「文档仓库分支名 → 部署后的版本号」。若新版本的分支名与版本号相同，则两者值一致；若分支名不同，需以实际分支名为 key。

示例：

```javascript
export const VITEPRESS_VERSIONS_CONFIG = {
  common: 'common',
  master: 'latest',
  // 这里添加新版本
  '7.0.0-RC3': '7.0.0-RC3',
  // ...其它版本
};
```

### 4. 更新 common.ts 中的 getSourceUrl 函数

修改 `app/.vitepress/src/utils/common.ts` 文件中的 `getSourceUrl` 函数：

1. 在函数内的 `map` 对象中添加新的版本映射关系
2. 格式为：`'版本号': '文档分支名',`（与第 3 步中的映射方向相反）
3. 在 `latest: 'master'` 后添加新版本

示例：

```typescript
const map: Record<string, string> = {
  common: 'common',
  latest: 'master',
  '新版本号': '文档分支名',  // 添加此行
  '7.0.0-RC3': '7.0.0-RC3',
  // ...其它版本
};
```

### 5. 更新 nginx 配置文件

修改 `deploy/nginx/nginx.portal.conf` 文件：

在最新版本（`latest`）对应的配置块之后、下一个版本配置块之前，添加新版本的转发信息。

代理地址中的版本号需要把 `.` 和 `_` 替换为 `-`，并且所有字母都转为小写。

例如：`7.0.0-RC3` 转换为 `7-0-0-rc3`

```nginx
# ============ 版本号 ============

location ~ ^/docs/版本号/(llms.txt|llms-full.txt|sitemap.xml)$ {
  proxy_set_header X-Forwarded-For $http_x_real_ip;
  proxy_set_header Connection "";

  proxy_pass https://docs-website-转换的版本号.opengauss-docs-new:8080/$1;
}

location /assets/版本号/ {
  proxy_set_header X-Forwarded-For $http_x_real_ip;
  proxy_set_header Connection "";

  proxy_pass https://docs-website-转换的版本号.opengauss-docs-new:8080;
}

location ~ ^/(zh|en)/docs/版本号(-lite)?/ {
  proxy_set_header X-Forwarded-For $http_x_real_ip;
  proxy_set_header Connection "";
  proxy_intercept_errors on;
  error_page 404 @fallback;

  proxy_pass https://docs-website-转换的版本号.opengauss-docs-new:8080;
}
```

注意：以上为 VitePress 版本（如 `latest`、`7.0.0-RC3`）的配置格式。若新增版本走 Hugo 渲染，需参考 `7.0.0-RC2` 及以下的旧格式（`location ^~ /docs/版本号/`），一般情况下新版本均为 VitePress 版本。

### 6. 验证修改

检查所有修改是否正确，确保：

1. 版本号格式正确（openGauss 格式，如 `7.0.0-RC3`）
2. `version.ts` 中 zh 和 en 数组都已添加新版本，且对象字段完整（label/value/link 或 href）
3. `scripts/config/version.js` 中的 `VITEPRESS_VERSIONS_CONFIG` 已添加新版本映射，且未改动 `HUGO_VERSIONS_CONFIG` 和已有配置
4. `common.ts` 中的 `map` 对象已添加新版本映射
5. nginx 代理地址中的版本号已正确转换（`.`、`_` 转 `-`，字母小写）

## 注意事项

- nginx配置：版本号在代理地址中需要转换为小写，并将点号和下划线替换为短横线
- 本项目的代理服务前缀为 `docs-website-`，服务域名为 `opengauss-docs-new`（勿照搬其他项目的 `openeuler-docs-website-*.openeuler-website-docs`）
- 本项目的版本映射配置中不存在 `stable-` 前缀，直接使用 `分支名: 版本号` 的映射形式

## 输出格式（严格遵守）

操作完成后，输出以下信息：

1. 已修改的文件列表
2. 添加的版本信息
3. 配置详情

示例：

```text
✅ 已添加版本：7.0.0-RC3

已修改文件：
- app/.vitepress/src/config/version.ts
- scripts/config/version.js
- app/.vitepress/src/utils/common.ts
- deploy/nginx/nginx.portal.conf

Nginx配置：
- 代理地址：https://docs-website-7-0-0-rc3.opengauss-docs-new:8080
```
