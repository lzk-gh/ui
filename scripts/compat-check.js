const fs = require('node:fs');
const path = require('node:path');

const COMPONENT_ROOT = path.resolve(process.cwd(), 'src');
const VUE_EXTENSION = '.vue';

const RULES = [
  { pattern: /\*\s*\{/g, message: '通配符选择器在小程序不支持' },
  { pattern: /::-webkit-/g, message: 'webkit 私有属性在 App 端可能失效' },
  { pattern: /position\s*:\s*fixed/g, message: 'fixed 定位各平台行为不一致，请确认' },
  { pattern: /<\s*div(\s|>)/g, message: 'div 标签在小程序不支持' },
  { pattern: /<\s*span(\s|>)/g, message: 'span 标签在小程序不支持' },
  { pattern: /<\s*img(\s|>)/g, message: 'img 标签在小程序不支持' },
  { pattern: /\bfilter\s*:/g, message: 'CSS filter 在 App 端支持有限' },
  { pattern: /<\s*picker(\s|>)/g, message: 'picker 跨平台差异大，建议使用条件编译' },
  { pattern: /<\s*component\b[^>]*(:is|is)\s*=/g, message: '小程序不支持 <component :is> 动态组件' },
];

/**
 * 递归收集目录下的 Vue 文件。
 * @param {string} rootDir 根目录
 * @returns {string[]} Vue 文件绝对路径
 */
function collectVueFiles(rootDir) {
  const files = [];
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectVueFiles(fullPath));
      continue;
    }

    if (entry.isFile() && fullPath.endsWith(VUE_EXTENSION)) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * 统一输出带相对路径的提示信息。
 * @param {string} filePath 文件绝对路径
 * @param {string} message 规则描述
 */
function printWarning(filePath, message) {
  const relativePath = path.relative(process.cwd(), filePath).split(path.sep).join('/');
  console.warn(`[compat-check] ${relativePath}: ${message}`);
}

function run() {
  if (!fs.existsSync(COMPONENT_ROOT)) {
    console.warn('[compat-check] 未找到 src 目录，跳过检查。');
    return;
  }

  const vueFiles = collectVueFiles(COMPONENT_ROOT);
  let warningCount = 0;

  for (const filePath of vueFiles) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    for (const rule of RULES) {
      const pattern = new RegExp(rule.pattern.source, rule.pattern.flags);
      if (!pattern.test(fileContent)) {
        continue;
      }
      printWarning(filePath, rule.message);
      warningCount += 1;
    }
  }

  if (warningCount === 0) {
    console.log('[compat-check] 未发现已知跨平台风险。');
    return;
  }

  console.warn(`[compat-check] 检查完成，共发现 ${warningCount} 条潜在兼容性风险。`);
}

run();
