<script setup lang="ts">
import { ref } from 'vue';

const activeNames1 = ref(['1']);
const activeNames2 = ref('1');
const activeNames3 = ref([]);
const activeNames4 = ref(['1']);
</script>

<template>
  <view class="collapse-demo">
    <demo-block title="基础用法 (分离模式)">
      <lk-collapse v-model="activeNames1">
        <lk-collapse-item name="1" title="标题1">
          代码是写出来给人看的，附带能在机器上运行。
        </lk-collapse-item>
        <lk-collapse-item name="2" title="标题2">
          技术无止境，学习需先行。
        </lk-collapse-item>
        <lk-collapse-item name="3" title="标题3">
          保持简单，保持愚蠢。
        </lk-collapse-item>
      </lk-collapse>
    </demo-block>

    <demo-block title="整体模式 (Unified Mode)">
      <lk-collapse v-model="activeNames4" type="unified">
        <lk-collapse-item name="1" title="会员权益">
          享受全场商品 95 折优惠，每月领券。
        </lk-collapse-item>
        <lk-collapse-item name="2" title="配送说明">
          支持全国配送，顺丰包邮，极速达。
        </lk-collapse-item>
        <lk-collapse-item name="3" title="退换货政策">
          七天无理由退换货，保障您的购物体验。
        </lk-collapse-item>
      </lk-collapse>
    </demo-block>

    <demo-block title="手风琴模式">
      <lk-collapse v-model="activeNames2" accordion>
        <lk-collapse-item name="1" title="标题1">
          手风琴模式下，每次只能展开一个面板。
        </lk-collapse-item>
        <lk-collapse-item name="2" title="标题2">
          展开当前面板时，其他面板会自动收起。
        </lk-collapse-item>
      </lk-collapse>
    </demo-block>

    <demo-block title="禁用状态">
      <lk-collapse v-model="activeNames3">
        <lk-collapse-item name="1" title="正常状态">
          这个面板可以正常操作。
        </lk-collapse-item>
        <lk-collapse-item name="2" title="禁用状态" disabled>
          这个面板被禁用了，无法点击。
        </lk-collapse-item>
      </lk-collapse>
    </demo-block>

    <demo-block title="自定义标题内容">
      <lk-collapse v-model="activeNames1">
        <lk-collapse-item name="1">
          <template #title>
            <view class="custom-title">
              <lk-icon name="star-fill" color="var(--lk-color-warning)" size="32" />
              <text>带图标的自定义标题</text>
            </view>
          </template>
          自定义标题插槽允许你放入任何组件。
        </lk-collapse-item>
      </lk-collapse>
    </demo-block>
  </view>
</template>

<style lang="scss" scoped>
.collapse-demo {
  padding-bottom: 40rpx;
}

.custom-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
</style>
