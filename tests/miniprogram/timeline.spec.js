const path = require('node:path');
const fs = require('node:fs');
const assert = require('node:assert');
const simulate = require('miniprogram-simulate');

/**
 * 获取微信小程序构建后的组件路径。
 * @param {string} name 组件名
 * @returns {string}
 */
function resolveComponentPath(name) {
  const base = 'dist/dev/mp-weixin/uni_modules/lucky-ui/components';
  return path.resolve(process.cwd(), `${base}/${name}/${name}`);
}

/**
 * 测试 lk-timeline 基本渲染
 */
function runTimelineBasicTest() {
  const timelinePath = resolveComponentPath('lk-timeline');
  const itemPath = resolveComponentPath('lk-timeline-item');
  
  assert.ok(fs.existsSync(`${timelinePath}.json`), '未检测到 lk-timeline 构建产物');
  assert.ok(fs.existsSync(`${itemPath}.json`), '未检测到 lk-timeline-item 构建产物');

  const timelineId = simulate.load(timelinePath);
  const itemId = simulate.load(itemPath);

  // 模拟父子嵌套
  const container = simulate.render(simulate.load({
    template: `
      <lk-timeline>
        <lk-timeline-item title="Item 1" />
        <lk-timeline-item title="Item 2" last="{{true}}" />
      </lk-timeline>
    `,
    usingComponents: {
      'lk-timeline': timelineId,
      'lk-timeline-item': itemId
    }
  }));
  container.attach(document.createElement('parent-wrapper'));

  const items = container.querySelectorAll('.lk-timeline-item');
  assert.strictEqual(items.length, 2, '应该渲染 2 个 item');

  // 检查第一项是否有线
  const firstLine = items[0].querySelector('.lk-timeline-item__line');
  assert.ok(firstLine, '第一项应该包含连接线');

  // 检查最后一项是否隐藏线
  const lastLine = items[1].querySelector('.lk-timeline-item__line');
  assert.ok(!lastLine, '最后一项（last=true）不应该包含连接线');
}

/**
 * 测试 lk-timeline 状态样式
 */
function runTimelineStatusTest() {
  const itemPath = resolveComponentPath('lk-timeline-item');
  const itemId = simulate.load(itemPath);

  const wrapper = simulate.render(itemId, {
    status: 'active',
    title: 'Active Step'
  });
  wrapper.attach(document.createElement('parent-wrapper'));

  const itemNode = wrapper.querySelector('.lk-timeline-item');
  assert.ok(itemNode.dom.className.includes('is-active'), 'status=active 时应包含 is-active 类');
}

module.exports = {
  runTimelineBasicTest,
  runTimelineStatusTest,
};
