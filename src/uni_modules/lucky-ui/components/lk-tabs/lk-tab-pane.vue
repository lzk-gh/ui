<script setup lang="ts">
import { inject, onMounted, onBeforeUnmount, ref, computed } from 'vue';

defineOptions({ name: 'LkTabPane' });

const props = defineProps({
  name: { type: [String, Number], required: true },
  label: { type: String, required: true }
});

const tabs = inject<any>('LkTabs');
const loaded = ref(false);
const active = computed(()=> tabs?.active.value === props.name);

onMounted(()=>{
  tabs?.register({ name: props.name, label: props.label });
});
onBeforeUnmount(()=> tabs?.unregister({ name: props.name }));

</script>

<template>
  <view class="lk-tab-pane" v-show="active" @touchstart="">
    <slot v-if="!tabs.lazy || active || (loaded=true)" />
  </view>
</template>

<style scoped>
.lk-tab-pane {
  width: 100%;
  box-sizing: border-box;
}
</style>