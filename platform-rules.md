# UniApp 平台差异规则

## 标签规则

| 场景 | H5 | 小程序 | App |
| --- | --- | --- | --- |
| 普通容器 | div / view | view | view |
| 文字 | span / text | text | text |
| 图片 | img | image | image |
| 滚动容器 | div | scroll-view | scroll-view |

## 样式规则

- 禁止：小程序不支持 `*` 通配符选择器
- 禁止：小程序 `scoped` 下不建议使用标签选择器穿透子组件
- 禁止：App 端部分场景不支持 `CSS filter`
- 使用：`rpx` 作为响应式单位
- 使用：平台差异场景必须使用条件编译

## 组件规则

- `picker` 在各平台表现不同，必须使用条件编译分支
- `textarea` 的 `padding` 在 App / 小程序可能无效，优先使用外层容器控制间距
- `position: fixed` 在小程序相对窗口，在 App 可能相对 webview，需单独验证
- 禁止在 UniApp 页面/组件中使用 `<component :is="...">` 动态组件，小程序端不支持

## AI 代码输出约束

1. 必须遵守本文件所有规则
2. 遇到平台差异代码必须附带条件编译
3. 需要标记 `⚠️可能存在平台差异` 的位置
4. 不允许输出小程序不支持的 CSS 选择器
