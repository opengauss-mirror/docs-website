/**
 * 从上游 version_name 中提取与本地版本 value 对应的版本号，如 "6.0.6 (LTS)" => "6.0.6"
 * @param {string} versionName 上游版本名称
 * @returns {string} 版本号，无有效内容时返回空字符串
 */
export function extractVersionKey(versionName: string): string {
  if (!versionName) {
    return '';
  }

  return versionName.trim().split(/\s+/)[0];
}

/**
 * 解析版本停止维护时间，兼容 "YYYY.MM.DD" 与 "YYYY.MM" 两种格式
 * @param {string} plannedEol 停止维护时间
 * @returns {number} 对应的时间戳，无法解析时返回 NaN
 */
export function parseEolTime(plannedEol: string): number {
  if (!plannedEol) {
    return NaN;
  }

  const matched = plannedEol.match(/^(\d{4})\.(\d{1,2})(?:\.(\d{1,2}))?$/);

  // 格式不符合预期时无法解析
  if (!matched) {
    return NaN;
  }

  const [, year, month, day] = matched;

  return new Date(Number(year), Number(month) - 1, Number(day ?? '1')).getTime();
}
