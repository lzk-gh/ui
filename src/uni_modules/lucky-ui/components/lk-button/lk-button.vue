<script setup lang="ts">
import { computed } from 'vue';

import { useRipple } from '../../composables/useRipple';

import { buttonProps, buttonEmits } from './button.props';

defineOptions({ name: 'LkButton' });

const props = defineProps(buttonProps);
const emit = defineEmits(buttonEmits);

const { rippleActive, rippleWaveStyle, triggerRipple } = useRipple({ duration: 800 });

const cls = computed(() => [
  'lk-ripple',
  'lk-button',
  `lk-button--${props.variant}`,
  `lk-button--${props.size}`,
  `lk-button--shape-${props.shape}`,
  {
    'is-loading': props.loading,
    'is-disabled': props.disabled,
    'is-block': props.block,
    'lk-ripple--active': rippleActive.value,
  },
]);

function onClick(e: unknown) {
  if (props.disabled || props.loading) return;
  triggerRipple(e);
  emit('click', e);
}
</script>

<template>
  <button 
    :class="cls" 
    :disabled="disabled" 
    :form-type="nativeType" 
    :open-type="openType"
    :hover-class="hoverClass"
    :hover-start-time="hoverStartTime"
    :hover-stay-time="hoverStayTime"
    :get-user-info="getUserInfo"
    :get-phone-number="getPhoneNumber"
    :get-authorize="getAuthorize"
    :session-from="sessionFrom"
    :send-message-title="sendMessageTitle"
    :send-message-path="sendMessagePath"
    :send-message-img="sendMessageImg"
    :show-message-card="showMessageCard"
    :app-parameter="appParameter"
    @tap="onClick"
    @getuserinfo="emit('getuserinfo', $event)"
    @contact="emit('contact', $event)"
    @getphonenumber="emit('getphonenumber', $event)"
    @error="emit('error', $event)"
    @opensetting="emit('opensetting', $event)"
    @launchapp="emit('launchapp', $event)"
    @chooseavatar="emit('chooseavatar', $event)"
    @agreeprivacyauthorization="emit('agreeprivacyauthorization', $event)"
  >
    <view v-if="loading" class="lk-button__loader" />
    <slot />
    <view class="lk-ripple__wave" :style="rippleWaveStyle" />
  </button>
</template>

<style lang="scss" scoped>
@use './index.scss';
</style>
