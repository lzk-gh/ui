---
title: Modal 模态框
phone: modal
---

# Modal 模态框

带遮罩的对话框，适用于重要信息确认、表单填写等需要打断用户流程的场景。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
const show = ref(false)
</script>

<template>
  <lk-button @click="show = true">打开模态框</lk-button>

  <lk-modal v-model="show" title="提示">
    <view>这是弹框内容，请确认操作。</view>
    <template #footer>
      <lk-button variant="text" @click="show = false">取消</lk-button>
      <lk-button @click="show = false">确认</lk-button>
    </template>
  </lk-modal>
</template>
```

## 确认对话框

```vue
<script setup lang="ts">
import { ref } from 'vue'
const show = ref(false)

function onConfirm() {
  show.value = false
  // 执行删除逻辑...
}
</script>

<template>
  <lk-button type="danger" variant="outline" @click="show = true">删除账号</lk-button>

  <lk-modal v-model="show" title="确认删除">
    <view style="text-align:center; padding: 16rpx 0">
      <lk-icon name="exclamation-triangle-fill" color="#ef4444" :size="48" />
      <view style="margin-top:16rpx">此操作不可撤销，确定要删除账号吗？</view>
    </view>
    <template #footer>
      <lk-button block variant="outline" @click="show = false">取消</lk-button>
      <lk-button block type="danger" @click="onConfirm">确认删除</lk-button>
    </template>
  </lk-modal>
</template>
```

## 无头部弹框

```vue
<script setup lang="ts">
import { ref } from 'vue'
const show = ref(false)
</script>

<template>
  <lk-button @click="show = true">纯内容弹框</lk-button>

  <lk-modal v-model="show" :show-header="false" :show-footer="false">
    <view style="padding:48rpx; text-align:center">
      <lk-icon name="check-circle-fill" color="#22c55e" :size="64" />
      <view style="font-size:36rpx; font-weight:600; margin-top:24rpx">支付成功！</view>
      <view style="color:#64748b; margin-top:8rpx">金额 ¥128.00 已到账</view>
      <lk-button block style="margin-top:48rpx" @click="show = false">我知道了</lk-button>
    </view>
  </lk-modal>
</template>
```

## 表单弹框

```vue
<script setup lang="ts">
import { ref } from 'vue'
const show = ref(false)
const form = ref({ name: '', phone: '' })
</script>

<template>
  <lk-button @click="show = true">填写信息</lk-button>

  <lk-modal v-model="show" title="完善资料" width="640rpx">
    <lk-form :model="form" style="padding:0">
      <lk-form-item label="姓名">
        <lk-input v-model="form.name" placeholder="请输入真实姓名" />
      </lk-form-item>
      <lk-form-item label="手机">
        <lk-input v-model="form.phone" type="tel" placeholder="请输入手机号" />
      </lk-form-item>
    </lk-form>
    <template #footer>
      <lk-button variant="text" @click="show = false">取消</lk-button>
      <lk-button @click="show = false">保存</lk-button>
    </template>
  </lk-modal>
</template>
```

## 动画类型

```vue
<template>
  <view class="demo-row">
    <lk-button @click="show1 = true">缩放（默认）</lk-button>
    <lk-button @click="show2 = true">从下方滑入</lk-button>
    <lk-button @click="show3 = true">渐显</lk-button>
  </view>

  <lk-modal v-model="show1" animation="scale" title="缩放动画">内容</lk-modal>
  <lk-modal v-model="show2" animation="slide-up" title="滑入动画">内容</lk-modal>
  <lk-modal v-model="show3" animation="fade" title="渐显动画">内容</lk-modal>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 是否显示（v-model） | `boolean` | `false` |
| title | 标题文字 | `string` | `''` |
| width | 弹框宽度 | `string` | `600rpx` |
| showClose | 显示右上角关闭按钮 | `boolean` | `true` |
| closeOnOverlay | 点击遮罩关闭 | `boolean` | `true` |
| showHeader | 是否显示标题栏 | `boolean` | `true` |
| showFooter | 是否显示底部区域 | `boolean` | `true` |
| animation | 动画预设 | `scale \| slide-up \| fade \| slide-down` | `scale` |
| zIndex | 层级 | `number` | `1500` |

### Events

| 事件名 | 说明 |
|--------|------|
| update:modelValue | 显示状态变化 |
| open | 弹框打开后 |
| close | 弹框关闭后 |
| confirm | 点击确认按钮 |
| cancel | 点击取消按钮 |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 弹框主体内容 |
| header | 自定义头部（会覆盖 title） |
| footer | 自定义底部按钮区域 |
