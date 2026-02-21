<script setup lang="ts">
import { computed, inject, getCurrentInstance, onMounted, onUnmounted } from 'vue';
import type { ComponentInternalInstance } from 'vue';
import { anchorLinkProps } from './anchor.props';

defineOptions({ name: 'LkAnchorLink' });
const props = defineProps(anchorLinkProps);
type AnchorContext = {
  activeHref: { value: string };
  register: (child: ComponentInternalInstance) => void;
  unregister: (child: ComponentInternalInstance) => void;
  handleClick: (href: string) => void;
  props: {
    showLine?: boolean;
  };
};

const parent = inject<AnchorContext | null>('lkAnchor', null);
const instance = getCurrentInstance();

const isActive = computed(() => parent?.activeHref.value === props.href);
const showLine = computed(() => parent?.props?.showLine);

function onClick() {
  if (props.disabled) return;
  parent?.handleClick(props.href);
}

onMounted(() => {
  if (parent && instance) parent.register(instance);
});

onUnmounted(() => {
  if (parent && instance) parent.unregister(instance);
});
</script>

<template>
  <view
    :id="'anchor-link-' + props.href"
    class="lk-anchor-link"
    :class="[
      isActive ? 'lk-anchor-link--active' : '',
      props.disabled ? 'lk-anchor-link--disabled' : '',
    ]"
    @click="onClick"
  >
    <view v-if="showLine && isActive" class="lk-anchor-link__indicator"></view>
    <view class="lk-anchor-link__title">
      <slot>{{ props.title }}</slot>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@use './index.scss';
</style>
