/**
 * 解析命令行具名参数
 * @returns {object} 解析后的参数对象，键为参数名，值为参数值
 */
export function parseNamedArgs() {
  const args = process.argv.slice(2);
  const namedArgs = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      if (value !== undefined) {
        // 等号后面作为值：--key=val
        namedArgs[key] = value;
      } else if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
        // 下一个参数作为值：--key val 
        namedArgs[key] = args[i + 1];
        i++; // 跳过下一个参数
      } else {
        // 后面没有值作为布尔类型，值为 true
        namedArgs[key] = true;
      }
    }
  }
  
  return namedArgs;
}