// 本文件由 scripts/gen-eol-versions.sh 在构建时基于 versions.yaml 自动生成，请勿手工编辑。
// 各 openGauss 版本的计划终止维护日期（planned_eol）与在维期状态（state，按版本名后缀 LTS/Preview/RC 推导）映射表，
// 供 static/js/eol-banner.js 在浏览器加载页面时：1) 校正 version-data.js 中各版本的 state（到期改为 EOM）；
// 2) 判断是否渲染"停止维护"横幅。日期格式为 YYYY.MM.DD 或 YYYY.MM；缺日时按当月 1 日计，当前时间 >= planned_eol 视为已停止维护。
window.OPENGAUSS_EOL_DATA = {
  "7.0.0": { eol: "2029.09.30", state: "LTS" },
  "7.0.0-RC3": { eol: "2026.09.30", state: "RC" },
  "7.0.0-RC2": { eol: "2026.03.30", state: "RC" },
  "7.0.0-RC1": { eol: "2025.09.30", state: "RC" },
  "6.0.6": { eol: "2027.09.30", state: "LTS" },
  "6.0.5": { eol: "2027.09.30", state: "LTS" },
  "6.0.3": { eol: "2027.09.30", state: "LTS" },
  "6.0.2": { eol: "2027.09.30", state: "LTS" },
  "6.0.1": { eol: "2027.09.30", state: "LTS" },
  "6.0.0": { eol: "2027.09.30", state: "LTS" },
  "5.0.5": { eol: "2026.03.31", state: "LTS" },
  "5.0.3": { eol: "2026.03.31", state: "LTS" },
  "6.0.0-RC1": { eol: "2024.09.30", state: "RC" },
  "5.0.2": { eol: "2026.03.31", state: "LTS" },
  "5.0.1": { eol: "2026.03.31", state: "LTS" },
  "5.1.0": { eol: "2024.03.31", state: "Preview" },
  "5.0.0": { eol: "2026.03.31", state: "LTS" },
  "3.1.1": { eol: "2023.03", state: "Preview" },
  "3.1.0": { eol: "2023.03.30", state: "Preview" },
  "3.0.6": { eol: "2025.03", state: "LTS" },
  "3.0.5": { eol: "2025.03", state: "LTS" },
  "3.0.3": { eol: "2024.03", state: "LTS" },
  "3.0.0": { eol: "2025.03.30", state: "LTS" },
  "2.1.0": { eol: "2022.03.30", state: "Preview" },
  "2.0.1": { eol: "2024.03", state: "LTS" },
  "2.0.0": { eol: "2024.03.30", state: "LTS" },
  "1.1.0": { eol: "2021.06", state: "Preview" },
  "1.0.1": { eol: "2023.06", state: "LTS" },
  "1.0.0": { eol: "2023.06", state: "LTS" }
};
