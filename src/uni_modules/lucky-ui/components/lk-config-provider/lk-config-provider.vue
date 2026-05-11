<script setup lang="ts">
import { watch } from 'vue';
import { Locale } from '../../locale';

defineOptions({ name: 'LkConfigProvider' });

const props = defineProps({
  /** 当前语言 */
  locale: {
    type: String,
    default: 'zh-Hans',
  },
  /** 自定义语言包映射 */
  messages: {
    type: Object,
    default: () => ({}),
  },
});

watch(
  () => props.locale,
  (newLocale) => {
    if (newLocale) {
      Locale.use(newLocale, props.messages?.[newLocale]);
    }
  },
  { immediate: true }
);

watch(
  () => props.messages,
  (newMessages) => {
    if (newMessages) {
      Locale.add(newMessages);
    }
  },
  { deep: true }
);
</script>

<template>
  <view class="lk-config-provider">
    <slot />
  </view>
</template>

<style lang="scss">
.lk-config-provider {
  display: block;
  width: 100%;
}
</style>
