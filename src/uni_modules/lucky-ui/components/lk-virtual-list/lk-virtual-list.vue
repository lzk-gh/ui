<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';

defineOptions({ name:'LkVirtualList' });

const props = defineProps({
  items: { type:Array as ()=>any[], default:()=>[] },
  itemHeight: { type:Number, default:100 }, // rpx => 将转 px 动态: 简化直接视作 px
  height: { type:Number, default:600 }, // 容器高度(px)
  buffer: { type:Number, default:5 },
  keyField: { type:String, default:'id' }
});
const emit = defineEmits(['scroll']);

const scrollTop = ref(0);
const wrapperRef = ref<any>();
const pxItem = computed(()=> props.itemHeight);
const totalHeight = computed(()=> props.items.length * pxItem.value);
const visibleCount = computed(()=> Math.ceil(props.height / pxItem.value) + props.buffer * 2);

const startIndex = computed(()=> {
  return Math.max(0, Math.floor(scrollTop.value / pxItem.value) - props.buffer);
});
const endIndex = computed(()=> Math.min(props.items.length, startIndex.value + visibleCount.value));
const visibleItems = computed(()=> props.items.slice(startIndex.value, endIndex.value));
const offsetY = computed(()=> startIndex.value * pxItem.value);

function onScroll(e:any){
  const top = e.detail?.scrollTop ?? e.target?.scrollTop ?? 0;
  scrollTop.value = top;
  emit('scroll', top);
}
</script>

<template>
  <scroll-view
      scroll-y
      :style="{ height: height+'px' }"
      class="lk-virtual-list"
      @scroll="onScroll"
      ref="wrapperRef"
  >
    <view :style="{ height: totalHeight + 'px', position:'relative'}">
      <view
          class="lk-virtual-list__inner"
          :style="{ transform:`translateY(${offsetY}px)` }"
      >
        <view
            v-for="(it,i) in visibleItems"
            :key="it[keyField] ?? i"
            class="lk-virtual-list__row"
            :style="{ height: pxItem + 'px' }"
        >
          <slot :item="it" :index="startIndex + i">{{ it }}</slot>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<style scoped lang="scss">
.lk-virtual-list {
  width:100%;
  background: var(--lk-color-bg-surface);
  border:2rpx solid var(--lk-color-border-weak);
  border-radius: var(--lk-radius-lg);
  &__row {
    display:flex;
    align-items:center;
    padding: 0 24rpx;
    border-bottom:2rpx solid var(--lk-color-border-weak);
    font-size:26rpx;
    color: var(--lk-color-text);
    &:last-child { border-bottom:none; }
  }
}
</style>