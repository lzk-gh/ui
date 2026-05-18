<script setup lang="ts">
import { inject, onMounted, onBeforeUnmount, ref, computed, watch } from 'vue';
import type { Ref } from 'vue';
import type { TabPaneContext, TabsValue } from './tabs.props';
import { resolveTabPaneLoaded } from './tabs.utils';

defineOptions({ name: 'LkTabPane' });

const props = defineProps({
  name: { type: [String, Number], required: true },
  label: { type: String, required: true },
  disabled: { type: Boolean, default: false },
});

interface TabsContext {
  register: (pane: TabPaneContext) => void;
  unregister: (pane: TabPaneContext) => void;
  active: Ref<TabsValue>;
  lazy: boolean;
}

const tabs = inject<TabsContext | null>('LkTabs', null);
const loaded = ref(false);
const active = computed(() => tabs?.active.value === props.name);

// 小程序端模板不执行副作用，使用 watch 管理首次懒加载。
watch(active, val => {
  if (val) loaded.value = true;
});

onMounted(() => {
  // 初始渲染：非 lazy 模式或当前为激活项时应立即渲染
  loaded.value = resolveTabPaneLoaded({
    lazy: !!tabs?.lazy,
    active: !!active.value,
  });
  tabs?.register({ name: props.name, label: props.label, disabled: props.disabled });
});

onBeforeUnmount(() => tabs?.unregister({ name: props.name, label: props.label }));
</script>

<template>
  <view v-show="active" class="lk-tab-pane">
    <slot v-if="!tabs?.lazy || loaded || active" />
  </view>
</template>

<style lang="scss">
@use './lk-tabs.scss';
</style>
