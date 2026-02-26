<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

/**
 * PropsPlayground — 文档调试模式组件
 * 可视化配置 Props → 实时预览 + 代码生成
 */

interface PropDef {
  key: string
  type: 'enum' | 'boolean' | 'string' | 'number'
  label?: string
  values?: string[]
  default: unknown
  description?: string
}

const props = defineProps<{
  /** 组件名称，如 'button' */
  component: string
  /** Props 定义列表 */
  propsDef: PropDef[]
  /** 默认插槽内容 */
  slotContent?: string
  /** 组件标签前缀，默认 lk */
  tagPrefix?: string
}>()

const BASE_URL = 'http://localhost:5173'

// ── 状态管理 ──
const currentValues = ref<Record<string, unknown>>({})
const slotText = ref(props.slotContent ?? '')
const expanded = ref(false)
const iframeReady = ref(false)
const iframeLoaded = ref(false)
const iframeRef = ref<HTMLIFrameElement | null>(null)

// 初始化所有 props 的当前值
function initValues() {
  const vals: Record<string, unknown> = {}
  for (const p of props.propsDef) {
    vals[p.key] = p.default
  }
  currentValues.value = vals
}
initValues()

// iframe URL
const frameUrl = computed(() => {
  return `${BASE_URL}/#/pages/playground/index?component=${encodeURIComponent(props.component)}`
})

// ── 生成代码 ──
const generatedCode = computed(() => {
  const tag = `${props.tagPrefix ?? 'lk'}-${props.component}`
  const attrs: string[] = []

  for (const p of props.propsDef) {
    const val = currentValues.value[p.key]
    if (val === p.default) continue // 跳过默认值

    if (p.type === 'boolean') {
      if (val === true) {
        attrs.push(p.key) // 简写 :loading → loading
      }
      // false 不输出（等于默认）
    } else if (p.type === 'number') {
      attrs.push(`:${p.key}="${val}"`)
    } else {
      attrs.push(`${p.key}="${val}"`)
    }
  }

  const attrStr = attrs.length ? ` ${attrs.join(' ')}` : ''
  const slot = slotText.value

  if (slot) {
    return `<${tag}${attrStr}>${slot}</${tag}>`
  }
  return `<${tag}${attrStr} />`
})

// ── 发送 props 到 iframe ──
function sendPropsToIframe() {
  if (!iframeRef.value?.contentWindow) return

  // 过滤掉与默认值相同的 props，只发送有变化的
  const propsToSend: Record<string, unknown> = {}
  for (const p of props.propsDef) {
    propsToSend[p.key] = currentValues.value[p.key]
  }

  iframeRef.value.contentWindow.postMessage({
    type: 'playground-props-update',
    props: propsToSend,
    slotContent: slotText.value,
  }, '*')
}

// 监听值变化，发送到 iframe
watch([currentValues, slotText], () => {
  if (iframeReady.value) {
    sendPropsToIframe()
  }
}, { deep: true })

// 监听 iframe 就绪消息
function handleMessage(event: MessageEvent) {
  if (event.data?.type === 'playground-ready') {
    iframeReady.value = true
    nextTick(() => sendPropsToIframe())
  }
}

function onIframeLoad() {
  iframeLoaded.value = true
}

// ── 操作 ──
function resetAll() {
  initValues()
  slotText.value = props.slotContent ?? ''
}

function copyCode() {
  navigator.clipboard.writeText(generatedCode.value).then(() => {
    copySuccess.value = true
    setTimeout(() => { copySuccess.value = false }, 2000)
  })
}

const copySuccess = ref(false)

onMounted(() => {
  window.addEventListener('message', handleMessage)
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<template>
  <div class="props-playground" :class="{ 'is-expanded': expanded }">
    <!-- 标题栏 -->
    <div class="playground-header" @click="expanded = !expanded">
      <div class="playground-header-left">
        <span class="playground-icon">🔧</span>
        <span class="playground-title">调试模式</span>
        <span class="playground-badge">Playground</span>
      </div>
      <div class="playground-header-right">
        <button v-if="expanded" class="pg-btn pg-btn--text" title="重置所有" @click.stop="resetAll">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          重置
        </button>
        <svg
          class="playground-chevron"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="currentColor"
        >
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
      </div>
    </div>

    <!-- 展开内容 -->
    <div v-show="expanded" class="playground-body">
      <div class="playground-columns">
        <!-- 左侧：Props 配置面板 -->
        <div class="playground-config">
          <div class="config-section">
            <div class="config-section-title">属性配置</div>

            <div v-for="prop in propsDef" :key="prop.key" class="config-item">
              <label class="config-label">
                <span class="config-key">{{ prop.key }}</span>
                <span v-if="prop.label" class="config-desc">{{ prop.label }}</span>
              </label>

              <!-- 枚举类型 -->
              <div v-if="prop.type === 'enum'" class="config-control">
                <div class="enum-group">
                  <button
                    v-for="val in prop.values"
                    :key="val"
                    class="enum-option"
                    :class="{ 'is-active': currentValues[prop.key] === val }"
                    @click="currentValues[prop.key] = val"
                  >
                    {{ val }}
                  </button>
                </div>
              </div>

              <!-- 布尔类型 -->
              <div v-else-if="prop.type === 'boolean'" class="config-control">
                <button
                  class="bool-toggle"
                  :class="{ 'is-on': currentValues[prop.key] === true }"
                  @click="currentValues[prop.key] = !currentValues[prop.key]"
                >
                  <span class="bool-dot" />
                  <span class="bool-label">{{ currentValues[prop.key] ? 'ON' : 'OFF' }}</span>
                </button>
              </div>

              <!-- 字符串类型 -->
              <div v-else-if="prop.type === 'string'" class="config-control">
                <input
                  class="config-input"
                  type="text"
                  :value="(currentValues[prop.key] as string)"
                  @input="currentValues[prop.key] = ($event.target as HTMLInputElement).value"
                />
              </div>

              <!-- 数字类型 -->
              <div v-else-if="prop.type === 'number'" class="config-control">
                <input
                  class="config-input config-input--number"
                  type="number"
                  :value="(currentValues[prop.key] as number)"
                  @input="currentValues[prop.key] = Number(($event.target as HTMLInputElement).value)"
                />
              </div>
            </div>

            <!-- 插槽内容 -->
            <div v-if="slotContent !== undefined" class="config-item">
              <label class="config-label">
                <span class="config-key">slot</span>
                <span class="config-desc">插槽内容</span>
              </label>
              <div class="config-control">
                <input
                  class="config-input"
                  type="text"
                  :value="slotText"
                  @input="slotText = ($event.target as HTMLInputElement).value"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：预览 -->
        <div class="playground-preview">
          <div class="preview-header">
            <span class="preview-title">实时预览</span>
            <div class="preview-actions">
              <button class="pg-btn pg-btn--icon" title="刷新" @click="iframeRef && (iframeRef.src = frameUrl)">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="preview-frame">
            <div v-if="!iframeLoaded" class="preview-loading">
              <div class="loading-spinner" />
              <span>连接预览服务...</span>
            </div>
            <iframe
              ref="iframeRef"
              :src="frameUrl"
              :class="{ 'is-loaded': iframeLoaded }"
              scrolling="no"
              frameborder="0"
              @load="onIframeLoad"
            />
          </div>
        </div>
      </div>

      <!-- 生成代码 -->
      <div class="playground-code">
        <div class="code-header">
          <span class="code-title">生成代码</span>
          <button class="pg-btn pg-btn--text" @click="copyCode">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
            {{ copySuccess ? '已复制!' : '复制' }}
          </button>
        </div>
        <pre class="code-block"><code>{{ generatedCode }}</code></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.props-playground {
  margin: 16px 0;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg);
  transition: box-shadow 0.2s;
}

.props-playground.is-expanded {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

/* ── 标题栏 ── */
.playground-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  user-select: none;
  background: var(--vp-c-bg-soft);
  transition: background 0.15s;
}

.playground-header:hover {
  background: var(--vp-c-bg-elv);
}

.playground-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.playground-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.playground-icon {
  font-size: 16px;
}

.playground-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.playground-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.playground-chevron {
  transition: transform 0.2s;
  color: var(--vp-c-text-2);
}

.is-expanded .playground-chevron {
  transform: rotate(180deg);
}

/* ── 主体 ── */
.playground-body {
  border-top: 1px solid var(--vp-c-border);
}

.playground-columns {
  display: flex;
  min-height: 280px;
}

@media (max-width: 768px) {
  .playground-columns {
    flex-direction: column;
  }
}

/* ── 配置面板 ── */
.playground-config {
  flex: 1;
  padding: 16px;
  border-right: 1px solid var(--vp-c-border);
  overflow-y: auto;
  max-height: 400px;
}

@media (max-width: 768px) {
  .playground-config {
    border-right: none;
    border-bottom: 1px solid var(--vp-c-border);
    max-height: 300px;
  }
}

.config-section-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.config-item {
  margin-bottom: 12px;
}

.config-label {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 6px;
}

.config-key {
  font-size: 13px;
  font-weight: 600;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-brand-1);
}

.config-desc {
  font-size: 11px;
  color: var(--vp-c-text-2);
}

/* ── 枚举选项组 ── */
.enum-group {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.enum-option {
  padding: 4px 10px;
  font-size: 12px;
  font-family: var(--vp-font-family-mono);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.15s;
}

.enum-option:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.enum-option.is-active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #fff;
}

/* ── 布尔开关 ── */
.bool-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  background: var(--vp-c-bg);
  cursor: pointer;
  transition: all 0.2s;
  min-width: 64px;
}

.bool-toggle.is-on {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.bool-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--vp-c-border);
  transition: all 0.2s;
}

.bool-toggle.is-on .bool-dot {
  background: #fff;
  transform: translateX(20px);
}

.bool-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  transition: color 0.15s;
}

.bool-toggle.is-on .bool-label {
  color: #fff;
  transform: translateX(-16px);
}

/* ── 输入框 ── */
.config-input {
  width: 100%;
  padding: 6px 10px;
  font-size: 13px;
  font-family: var(--vp-font-family-mono);
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
}

.config-input:focus {
  border-color: var(--vp-c-brand-1);
}

.config-input--number {
  width: 120px;
}

/* ── 预览面板 ── */
.playground-preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
}

.preview-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.preview-actions {
  display: flex;
  gap: 4px;
}

.preview-frame {
  flex: 1;
  position: relative;
  min-height: 200px;
  background: #fff;
}

.preview-frame iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
  opacity: 0;
  transition: opacity 0.3s;
}

.preview-frame iframe.is-loaded {
  opacity: 1;
}

.preview-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  z-index: 1;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: pg-spin 0.8s linear infinite;
}

@keyframes pg-spin {
  to { transform: rotate(360deg); }
}

/* ── 代码区域 ── */
.playground-code {
  border-top: 1px solid var(--vp-c-border);
}

.code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.code-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.code-block {
  margin: 0;
  padding: 16px;
  font-size: 13px;
  line-height: 1.6;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

/* ── 按钮 ── */
.pg-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s, color 0.15s;
}

.pg-btn--text {
  padding: 4px 8px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.pg-btn--text:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.pg-btn--icon {
  padding: 4px;
  color: var(--vp-c-text-2);
}

.pg-btn--icon:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}
</style>
