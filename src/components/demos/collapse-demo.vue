<script setup lang="ts">
import { ref } from 'vue';
import LkCollapse from '@/uni_modules/lucky-ui/components/lk-collapse/lk-collapse.vue';
import LkCollapseItem from '@/uni_modules/lucky-ui/components/lk-collapse/lk-collapse-item.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const activeNames1 = ref(['1']);
const activeNames2 = ref('1');
const activeNames3 = ref(['1']);
</script>

<template>
  <view class="component-demo">
    <demo-block title="基础用法">
      <lk-collapse v-model="activeNames1">
        <lk-collapse-item name="1" title="标题1">
          <view class="collapse-content"> 代码是写出来给人看的，附带能在机器上运行 </view>
        </lk-collapse-item>
        <lk-collapse-item name="2" title="标题2">
          <view class="collapse-content"> 过早的优化是万恶之源 </view>
        </lk-collapse-item>
        <lk-collapse-item name="3" title="标题3">
          <view class="collapse-content"> 程序员的三大美德：懒惰、急躁和傲慢 </view>
        </lk-collapse-item>
      </lk-collapse>
    </demo-block>

    <demo-block title="手风琴模式">
      <lk-collapse v-model="activeNames2" accordion>
        <lk-collapse-item name="1" title="标题1">
          <view class="collapse-content"> 手风琴模式，同时只能展开一个面板 </view>
        </lk-collapse-item>
        <lk-collapse-item name="2" title="标题2">
          <view class="collapse-content"> 点击其他面板会自动关闭当前面板 </view>
        </lk-collapse-item>
        <lk-collapse-item name="3" title="标题3">
          <view class="collapse-content"> 适合FAQ等场景 </view>
        </lk-collapse-item>
      </lk-collapse>
    </demo-block>

    <demo-block title="禁用状态">
      <lk-collapse v-model="activeNames3">
        <lk-collapse-item name="1" title="正常">
          <view class="collapse-content"> 可以正常展开 </view>
        </lk-collapse-item>
        <lk-collapse-item name="2" title="禁用" disabled>
          <view class="collapse-content"> 此面板已禁用 </view>
        </lk-collapse-item>
      </lk-collapse>
    </demo-block>
  </view>
</template>
<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.collapse-content {
  padding: 24rpx;
  font-size: 28rpx;
  color: var(--lk-color-text-secondary);
  line-height: 1.6;
}
</style>
