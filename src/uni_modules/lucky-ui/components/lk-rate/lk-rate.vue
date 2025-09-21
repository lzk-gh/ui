<script setup lang="ts">
import { ref, watch, computed, inject } from 'vue';
import { formContextKey } from '../lk-form/context';

defineOptions({ name:'LkRate' });

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  count: { type: Number, default: 5 },
  allowHalf: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: '40' }, // rpx
  prop: { type: String, default: '' }
});
const emit = defineEmits(['update:modelValue','change','hover']);

const form = inject(formContextKey, null);

const value = ref(props.modelValue);
watch(()=>props.modelValue, v=> value.value=v);

function set(val:number) {
  if(props.disabled) return;
  if(val<0) val=0;
  if(val>props.count) val=props.count;
  if(val !== value.value) {
    value.value = val;
    emit('update:modelValue', val);
    emit('change', val);
    if(props.prop) form?.emitFieldChange(props.prop);
  }
}

function onTap(i:number, e:any) {
  if(props.disabled) return;
  if(props.allowHalf) {
    const rect = e.target.getBoundingClientRect?.() || {};
    const x = e.changedTouches?.[0]?.clientX || e.clientX;
    const isHalf = x - rect.left < rect.width /2;
    set(i - (isHalf?0.5:0) );
  } else {
    set(i);
  }
}

const stars = computed(()=> Array.from({ length: props.count }, (_,i)=> i+1));
</script>

<template>
  <view class="lk-rate" :class="{ 'is-disabled': disabled }">
    <view
        v-for="i in stars"
        :key="i"
        class="lk-rate__item"
        @click="onTap(i, $event)"
        @touchend="onTap(i, $event)"
    >
      <view class="lk-rate__icon" :class="{ 'is-full': value >= i, 'is-half': allowHalf && value + 1 > i && value < i }" :style="{ width: size+'rpx', height:size+'rpx' }">
        <svg viewBox="0 0 24 24" class="lk-rate__svg">
          <path
              class="lk-rate__star-bg"
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          />
          <path
              class="lk-rate__star-fg"
              :style="{
              clipPath: (allowHalf && value +1 > i && value < i) ? 'inset(0 50% 0 0)' : (value >= i ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)')
            }"
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          />
        </svg>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.lk-rate {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  &__item { display: inline-flex; }
  &__icon {
    position: relative;
  }
  &__svg { width: 100%; height: 100%; }
  &__star-bg {
    fill: var(--lk-color-primary-bg-soft);
  }
  &__star-fg {
    fill: var(--lk-color-primary);
    transition: clip-path var(--lk-transition-fast);
  }
  &.is-disabled { opacity: .5; }
}
</style>