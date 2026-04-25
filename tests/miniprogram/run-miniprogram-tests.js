const { runButtonSnapshotTest } = require('./button.spec');

function run() {
  try {
    runButtonSnapshotTest();
    console.log('[test:mp] lk-button 小程序渲染测试通过。');
  } catch (error) {
    console.error('[test:mp] 小程序渲染测试失败。');
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

run();
