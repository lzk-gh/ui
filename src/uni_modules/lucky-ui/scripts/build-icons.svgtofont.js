// 使用 svgtofont 生成字体与 CSS，并生成 codepoints.ts
// 运行：pnpm run icons:build

(async () => {
  const svgtofont = (await import('svgtofont')).default; // ESM 动态导入
  const path = require('path');
  const fs = require('fs').promises;
  const cfg = require('./iconset.mobile.config.js');

  const moduleRoot = path.resolve(__dirname, '..'); // src/uni_modules/lucky-ui

  const srcDir = path.resolve(moduleRoot, cfg.outDir); // assets/bootstrap-icons-selected
  const outDir = path.resolve(moduleRoot, 'components/lk-icon/fonts');

  await svgtofont({
    src: srcDir,
    dist: outDir,
    fontName: 'lk-icons',
    css: true, // 生成 lk-icons.css（包含 @font-face）
    types: ['woff2', 'woff', 'ttf', 'svg'],
    classNamePrefix: 'lk-icon',
    website: null,
    svgicons2svgfont: {
      normalize: true,
      fontHeight: 1000,
      descent: 0,
    },
  });

  // 从生成的 SVG 字体抽取 codepoints
  const svgFontPath = path.join(outDir, 'lk-icons.svg');
  const svgContent = await fs.readFile(svgFontPath, 'utf8');

  const map = {};
  const glyphRe = /<glyph[^>]*glyph-name="([^"]+)"[^>]*unicode="([^"]+)"[^>]*\/>/g;
  let m;
  while ((m = glyphRe.exec(svgContent))) {
    const name = m[1];
    const u = m[2];
    let cp;
    if (u.startsWith('&#x')) cp = parseInt(u.slice(3, -1), 16);
    else if (u.startsWith('&#')) cp = parseInt(u.slice(2, -1), 10);
    else cp = u.codePointAt(0);
    map[name] = cp;
  }

  const outTs = `// 此文件由 build-icons.svgtofont.js 自动生成
export const ICON_CODEPOINTS: Record<string, number> = ${JSON.stringify(map, null, 2)} as const;

export type BuiltInIconName = keyof typeof ICON_CODEPOINTS;

export function iconCharOf(name: string): string {
  const cp = (ICON_CODEPOINTS as Record<string, number>)[name];
  return cp ? String.fromCodePoint(cp) : '';
}
`;
  const codepointsPath = path.resolve(moduleRoot, 'components/lk-icon/codepoints.ts');
  await fs.writeFile(codepointsPath, outTs, 'utf8');

  console.log('[icons] 字体与 CSS =>', outDir);
  console.log('[icons] codepoints.ts =>', codepointsPath);
})().catch(err => {
  console.error('[icons] 构建失败：', err);
  process.exit(1);
});
