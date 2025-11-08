// fantasticon 配置：将 assets/bootstrap-icons-selected 下的 SVG 生成字体与 CSS、并输出到组件目录
// 运行构建请使用 scripts/build-icons.svgtofont.js

const path = require('path');

const root = process.cwd();

module.exports = {
  inputDir: path.resolve(root, 'assets/bootstrap-icons-selected'),
  outputDir: path.resolve(root, 'components/lk-icon/fonts'),
  name: 'lk-icons',
  fontTypes: ['woff2', 'woff'],
  assetTypes: ['css'], // CSS 由 fantasticon 生成；codepoints.ts 我们自己写，便于按需导出
  prefix: 'lk-icon',
  tag: 'i',
  fontsUrl: '.', // 让 CSS 使用相对路径
  codepoints: {}, // 首次留空，生成后可将 scripts/iconset.mobile.lock.json 中的映射固化，避免抖动
  normalize: true,
  descent: 0,
  formatOptions: {
    ttf: { ts: 0 },
  },
};
