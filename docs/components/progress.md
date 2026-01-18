---
title: Progress 进度条
---

# Progress 进度条

展示任务的当前进度。

## 属性 (Props)

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| percentage | 进度百分比 | `number` | `0` |
| stroke-width | 进度条高度 (rpx) | `number` | `12` |
| striped | 是否显示条纹 | `boolean` | `false` |
| animated | 是否显示动画条纹 | `boolean` | `false` |
| show-text | 是否显示进度文字 | `boolean` | `true` |
| text-inside | 进度文字是否内显 | `boolean` | `false` |
| color | 进度条颜色 | `string` | - |
| track-color | 轨道颜色 | `string` | - |
| status | 状态 (`success`, `warning`, `error`) | `string` | - |

## 基础用法

展示基本的线性进度条。

```vue
<lk-progress :percentage="50" />
```

## 条纹效果

可以通过 `striped` 属性设置条纹效果，通过 `animated` 属性设置动画效果。

```vue
<lk-progress :percentage="50" striped animated />
```

## 自定义高度与颜色

```vue
<lk-progress :percentage="50" :stroke-width="24" color="#f56c6c" />
```

参考 Demo：
- https://github.com/lzk-gh/ui/blob/main/src/components/demos/progress-demo.vue
