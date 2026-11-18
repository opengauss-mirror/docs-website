#!/usr/bin/env bash
# 构建时拉取 openGauss 版本元数据 versions.yaml，依据各版本 planned_eol 生成停维(EOM)判断数据：
#   data/eolVersions.yaml  —— 截至构建时已越过 planned_eol 的文档版本目录名清单，供 Hugo SSG 阶段渲染"停止维护"横幅
#   static/js/eol-data.js  —— 完整的 版本 -> { planned_eol, 在维期state } 映射表，供浏览器端（static/js/eol-banner.js）
#                             加载页面时校正 version-data.js 中各版本的 state（到期改为 EOM）并实时判断是否渲染停维横幅
# 拉取或解析失败时不覆盖仓库内已提交的兜底文件，构建继续。
set -u

SRC_URL="https://raw.atomgit.com/opengauss/website/raw/v2/.content/download/versions.yaml"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_YAML="$ROOT/data/eolVersions.yaml"
OUT_JS="$ROOT/static/js/eol-data.js"
TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT

if command -v curl >/dev/null 2>&1; then
  fetch_ok=1
  curl -fsSL --connect-timeout 10 --retry 2 -o "$TMP" "$SRC_URL" || fetch_ok=0
elif command -v wget >/dev/null 2>&1; then
  fetch_ok=1
  wget -q -T 10 -t 2 -O "$TMP" "$SRC_URL" || fetch_ok=0
else
  echo "WARN: no curl/wget available, keep committed EOL data" >&2
  exit 1
fi
if [ "$fetch_ok" -ne 1 ]; then
  echo "WARN: fetch $SRC_URL failed, keep committed EOL data" >&2
  exit 1
fi
if ! grep -q "version_name:" "$TMP"; then
  echo "WARN: unexpected versions.yaml content, keep committed EOL data" >&2
  exit 1
fi

TODAY="$(date +%Y%m%d)"

awk -v today="$TODAY" -v yaml="$OUT_YAML" -v js="$OUT_JS" '
# version_name 形如 "7.0.0 (LTS)" / "3.1.1 (Preview)" / 7.0.0-RC3，
# 取括号前的版本号作为文档目录名（与 content/{zh,en}/docs/<version> 对应，-lite 后缀在模板中另行剥离）；
# 同时按名称后缀推导版本在维护期内的周期状态（state hint），供客户端回写 version-data.js 的 state 使用
function clean(s) {
  gsub(/"/, "", s)
  sub(/\(.*/, "", s)
  gsub(/[ \t\r]/, "", s)
  return s
}
function getHint(s) {
  if (s ~ /\(LTS\)/) return "LTS"
  if (s ~ /\(Preview\)/) return "Preview"
  if (s ~ /-RC/) return "RC"
  return ""
}
function flush() {
  if (ver != "") {
    if (eol ~ /^[0-9]+\.[0-9]+$/ || eol ~ /^[0-9]+\.[0-9]+\.[0-9]+$/) { n++; v[n] = ver; d[n] = eol; h[n] = hint }
    else if (eol != "") { print "WARN: skip version " ver " with unexpected planned_eol: " eol > "/dev/stderr" }
  }
  ver = ""; eol = ""; hint = ""
}
/^[[:space:]]*-[[:space:]]+version_name:/ { flush(); s = $0; sub(/^[^:]*:/, "", s); hint = getHint(s); ver = clean(s); next }
/^[[:space:]]+version_name:/              { flush(); s = $0; sub(/^[^:]*:/, "", s); hint = getHint(s); ver = clean(s); next }
/^[[:space:]]+planned_eol:/               { s = $0; sub(/^[^:]*:/, "", s); eol = clean(s); next }
END {
  flush()
  if (n < 1) { print "WARN: no version parsed from versions.yaml, keep committed EOL data" > "/dev/stderr"; exit 3 }

  # 1) SSG 清单：today >= planned_eol 视为已停维；"YYYY.MM" 缺日时取当月 1 日
  print "# 本文件由 scripts/gen-eol-versions.sh 在构建时基于 versions.yaml 自动生成，请勿手工编辑。" > yaml
  print "# 已越过 planned_eol（停止维护）的文档版本目录名清单，用于 SSG 阶段在文档页顶部渲染\"停止维护\"提示横幅。" >> yaml
  print "# 版本目录名与 content/{zh,en}/docs/<version> 及 URL 中的版本段一致（lite 版会先去掉 -lite 后缀再匹配）。" >> yaml
  print "# 拉取 versions.yaml 失败时以本文件的已提交内容兜底；浏览器端实时判断（横幅与版本 state 校正）见 static/js/eol-data.js。" >> yaml
  print "# 注意：必须加引号，否则 YAML 会把 3.1.0 这类含点号的版本号解析成浮点数，导致模板字符串比对失败。" >> yaml
  eolCount = 0
  for (i = 1; i <= n; i++) {
    split(d[i], p, ".")
    day = (p[3] == "" ? 1 : p[3] + 0)
    num = sprintf("%04d%02d%02d", p[1] + 0, p[2] + 0, day) + 0
    if (num <= today + 0) { print "- \"" v[i] "\"" >> yaml; eolCount++ }
  }

  # 2) 浏览器端全量映射：由 eol-banner.js 在加载页面时用当前时间实时判断
  print "// 本文件由 scripts/gen-eol-versions.sh 在构建时基于 versions.yaml 自动生成，请勿手工编辑。" > js
  print "// 各 openGauss 版本的计划终止维护日期（planned_eol）与在维期状态（state，按版本名后缀 LTS/Preview/RC 推导）映射表，" >> js
  print "// 供 static/js/eol-banner.js 在浏览器加载页面时：1) 校正 version-data.js 中各版本的 state（到期改为 EOM）；" >> js
  print "// 2) 判断是否渲染\"停止维护\"横幅。日期格式为 YYYY.MM.DD 或 YYYY.MM；缺日时按当月 1 日计，当前时间 >= planned_eol 视为已停止维护。" >> js
  print "window.OPENGAUSS_EOL_DATA = {" >> js
  for (i = 1; i <= n; i++) {
    printf "  \"%s\": { eol: \"%s\", state: \"%s\" }%s\n", v[i], d[i], h[i], (i < n ? "," : "") >> js
  }
  print "};" >> js

  printf "EOL data generated: %d versions parsed, %d past planned_eol (as of %s)\n", n, eolCount, today > "/dev/stdout"
}' "$TMP"
exit $?
