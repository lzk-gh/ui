// 用法：node src/uni_modules/lucky-ui/scripts/gen-font-base64.js
// 读取 components/lk-icon/fonts/lk-icons.woff -> 生成同目录 lk-icons.base64.ts
const fs = require('fs').promises;
const path = require('path');

(async () => {
  const moduleRoot = path.resolve(__dirname, '..');
  const woffPath = path.resolve(moduleRoot, 'components/lk-icon/fonts/lk-icons.woff');
  const outTs = path.resolve(moduleRoot, 'components/lk-icon/fonts/lk-icons.base64.ts');

  const buf = await fs.readFile(woffPath);
  const base64 = buf.toString('base64');
  const ts = `// 自动生成：lk-icons.woff 的 base64 内容
export const LK_ICONS_WOFF_BASE64 = '${base64}';
`;
  await fs.writeFile(outTs, ts, 'utf8');
  console.log('[icons] base64 written:', outTs);
})();
