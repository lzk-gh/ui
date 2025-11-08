// 从 bootstrap-icons/icons 目录按配置筛选并复制到 outDir，生成锁定清单。
// 运行：pnpm run icons:prepare
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const cfg = require('./iconset.mobile.config.js');

const moduleRoot = path.resolve(__dirname, '..'); // 指向 src/uni_modules/lucky-ui

async function resolveBootstrapIconsDir() {
  const pkgPath = require.resolve('bootstrap-icons/package.json', {
    paths: [process.cwd()],
  });
  const root = path.dirname(pkgPath);
  return path.join(root, 'icons');
}

function toRegexList(patterns = []) {
  return patterns.map(p => new RegExp(p));
}
function matchAny(name, regexList) {
  return regexList.some(re => re.test(name));
}
async function ensureEmptyDir(dir) {
  await fsp.mkdir(dir, { recursive: true });
  const files = await fsp.readdir(dir);
  await Promise.all(files.map(f => fsp.rm(path.join(dir, f), { recursive: true, force: true })));
}
async function ensureParentDir(filePath) {
  await fsp.mkdir(path.dirname(filePath), { recursive: true });
}

async function main() {
  const iconsDir = await resolveBootstrapIconsDir();
  const all = (await fsp.readdir(iconsDir))
    .filter(f => f.endsWith('.svg'))
    .map(f => f.replace(/\.svg$/, ''));

  const includeRE = toRegexList(cfg.includePatterns || []);
  const excludeRE = toRegexList(cfg.excludePatterns || []);
  const explicit = new Set(cfg.explicitInclude || []);

  const included = new Set();

  for (const name of all) {
    const inByPattern = includeRE.length ? matchAny(name, includeRE) : false;
    const inByExplicit = explicit.has(name);
    if ((inByPattern || inByExplicit) && !matchAny(name, excludeRE)) {
      included.add(name);
    }
  }

  // 解析输出与锁文件的绝对路径（基于模块根）
  const outDir = path.resolve(moduleRoot, cfg.outDir);
  const lockPath = path.resolve(moduleRoot, cfg.lockFile);

  await ensureEmptyDir(outDir);

  let copied = 0;
  for (const name of Array.from(included).sort()) {
    const src = path.join(iconsDir, `${name}.svg`);
    const dst = path.join(outDir, `${name}.svg`);
    await fsp.copyFile(src, dst);
    copied++;
  }

  const lock = {
    generatedAt: new Date().toISOString(),
    total: copied,
    outDir: path.relative(moduleRoot, outDir).replace(/\\/g, '/'),
    items: Array.from(included).sort(),
  };

  await ensureParentDir(lockPath);
  await fsp.writeFile(lockPath, JSON.stringify(lock, null, 2), 'utf8');

  console.log(`[icons] 发现 ${all.length} 个 bootstrap-icons，选入 ${copied} 个。`);
  console.log(`[icons] 输出目录：${outDir}`);
  console.log(`[icons] 锁定清单：${lockPath}`);
  console.log(`[next] 运行：pnpm run icons:build 生成字体与映射`);
}

main().catch(err => {
  console.error('[icons] 处理失败：', err);
  process.exit(1);
});
