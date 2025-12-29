<script setup lang="ts">
import { inject, onMounted, onBeforeUnmount, ref, computed, watch } from 'vue';

defineOptions({ name: 'LkTabPane' });

const props = defineProps({
  name: { type: [String, Number], required: true },
  label: { type: String, required: true },
});

const tabs = inject<any>('LkTabs');
const loaded = ref(false);
const active = computed(() => tabs?.active.value === props.name);

// 小程序端不支持在模板中进行赋值等副作用，这里用 watch 管理懒加载一次
watch(active, val => {
  if (val) loaded.value = true;
});

onMounted(() => {
  // 初始渲染：非 lazy 模式或当前为激活项时应立即渲染
  loaded.value = !tabs?.lazy || !!active.value;
  tabs?.register({ name: props.name, label: props.label });
});

onBeforeUnmount(() => tabs?.unregister({ name: props.name }));
</script>

<template>
  <view class="lk-tab-pane" v-show="active">
    <slot v-if="!tabs?.lazy || loaded || active" />
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
