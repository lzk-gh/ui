<script setup lang="ts">
import { ref, computed } from 'vue'
import { indexBarProps, indexBarEmits } from './index-bar.props'

defineOptions({ name: 'LkIndexBar' })

const props = defineProps(indexBarProps)
const emit = defineEmits(indexBarEmits)

const active = ref('')
const touching = ref(false)
const indicatorVisible = ref(false)
const indicatorText = ref('')

// 侧边栏项目的位置缓存
let itemRects: { top: number; bottom: number; letter: string }[] = []
let sidebarTop = 0

// 高亮颜色
const highlightStyle = computed(() => {
  if (props.highlightColor) {
    return { '--_highlight-color': props.highlightColor }
  }
  return {}
})

function scrollTo(letter: string) {
  if (active.value === letter) return
  emit('select', letter)
  active.value = letter

  // 震动反馈
  // #ifdef APP-PLUS || MP-WEIXIN
  try {
    uni.vibrateShort({ type: 'light' })
  } catch {}
  // #endif

  // #ifdef H5
  try {
    const root: HTMLElement | Window = props.scrollTarget
      ? (document.querySelector(props.scrollTarget) as HTMLElement)
      : window
    const selector = props.scrollTarget
      ? `${props.scrollTarget} [data-lk-index-anchor="${letter}"]`
      : `[data-lk-index-anchor="${letter}"]`
    const el = document.querySelector(selector) as HTMLElement | null

    if (el) {
      if (root === window) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        const rect = el.getBoundingClientRect()
        const container = root as HTMLElement
        container.scrollTo({
          top: rect.top - container.getBoundingClientRect().top + container.scrollTop,
          behavior: 'smooth',
        })
      }
    }
  } catch {}
  // #endif

  // #ifndef H5
  try {
    const q = uni.createSelectorQuery()
    const target = props.scrollTarget || ''
    const sel = `${target ? target + ' ' : ''}[data-lk-index-anchor="${letter}"]`
    q.select(sel).boundingClientRect()
    // @ts-ignore
    q.selectViewport().scrollOffset && q.selectViewport().scrollOffset()
    q.exec((res) => {
      const rect = res[0]
      const viewport = res[1]
      if (rect && viewport) {
        uni.pageScrollTo({
          scrollTop: rect.top + viewport.scrollTop,
          duration: 200,
        })
      }
    })
  } catch {}
  // #endif
}

function showIndicator(letter: string) {
  if (props.showIndicator) {
    indicatorText.value = letter
    indicatorVisible.value = true
  }
}

function hideIndicator() {
  indicatorVisible.value = false
}

// 触摸开始
function onTouchStart(e: TouchEvent) {
  touching.value = true
  updateItemRects()
  handleTouch(e)
}

// 触摸移动
function onTouchMove(e: TouchEvent) {
  if (!touching.value) return
  e.preventDefault?.()
  handleTouch(e)
}

// 触摸结束
function onTouchEnd() {
  touching.value = false
  hideIndicator()
}

// 更新侧边栏项目位置
function updateItemRects() {
  // #ifdef H5
  try {
    const items = document.querySelectorAll('.lk-index-bar__item')
    const sidebar = document.querySelector('.lk-index-bar__sidebar') as HTMLElement
    if (sidebar) {
      sidebarTop = sidebar.getBoundingClientRect().top
    }
    itemRects = Array.from(items).map((item, i) => {
      const rect = item.getBoundingClientRect()
      return {
        top: rect.top - sidebarTop,
        bottom: rect.bottom - sidebarTop,
        letter: props.indexList[i] || '',
      }
    })
  } catch {}
  // #endif
}

// 处理触摸
function handleTouch(e: TouchEvent) {
  const touch = e.touches[0]
  if (!touch) return

  // #ifdef H5
  const y = touch.clientY - sidebarTop
  for (const item of itemRects) {
    if (y >= item.top && y <= item.bottom) {
      showIndicator(item.letter)
      scrollTo(item.letter)
      break
    }
  }
  // #endif
}

function onItemClick(letter: string) {
  showIndicator(letter)
  scrollTo(letter)
  setTimeout(hideIndicator, 300)
}
</script>

<template>
  <view class="lk-index-bar" :style="highlightStyle">
    <slot />

    <!-- 大字母指示器 -->
    <view v-if="indicatorVisible" class="lk-index-bar__indicator">
      <text class="lk-index-bar__indicator-text">{{ indicatorText }}</text>
    </view>

    <!-- 侧边栏 -->
    <view
      class="lk-index-bar__sidebar"
      :class="{ 'is-touching': touching }"
      @touchstart="onTouchStart"
      @touchmove.prevent="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <view
        v-for="ch in indexList"
        :key="ch"
        class="lk-index-bar__item"
        :class="{ 'is-active': active === ch }"
        @click.stop="onItemClick(ch)"
      >
        {{ ch }}
      </view>
    </view>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
