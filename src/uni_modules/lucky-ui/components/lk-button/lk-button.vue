<script setup lang="ts">
import type { StyleValue } from 'vue';
import { computed } from 'vue';

import { useRipple } from '@/uni_modules/lucky-ui/composables/useRipple';

import LkIcon from '../lk-icon/lk-icon.vue';
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
  props.customClass,
]);

const formType = computed(() => (props.nativeType === 'button' ? '' : props.nativeType));
const isNativeDisabled = computed(() => props.disabled || props.loading);
const style = computed(() => props.customStyle as StyleValue);

const isRippleEnabled = computed(() => props.ripple && props.variant !== 'text');

function onClick(e: unknown) {
  if (props.disabled || props.loading) return;
  if (isRippleEnabled.value) {
    triggerRipple(e);
  }
  emit('click', e);
}

function emitNativeEvent(
  name:
    | 'getuserinfo'
    | 'getphonenumber'
    | 'getrealtimephonenumber'
    | 'error'
    | 'opensetting'
    | 'launchapp'
    | 'contact'
    | 'chooseavatar'
    | 'agreeprivacyauthorization'
    | 'addgroupapp'
    | 'chooseaddress'
    | 'chooseinvoicetitle'
    | 'subscribe'
    | 'login'
    | 'im',
  e: unknown
) {
  if (props.disabled || props.loading) return;
  switch (name) {
    case 'getuserinfo':
      emit('getuserinfo', e);
      break;
    case 'getphonenumber':
      emit('getphonenumber', e);
      break;
    case 'getrealtimephonenumber':
      emit('getrealtimephonenumber', e);
      break;
    case 'error':
      emit('error', e);
      break;
    case 'opensetting':
      emit('opensetting', e);
      break;
    case 'launchapp':
      emit('launchapp', e);
      break;
    case 'contact':
      emit('contact', e);
      break;
    case 'chooseavatar':
      emit('chooseavatar', e);
      break;
    case 'agreeprivacyauthorization':
      emit('agreeprivacyauthorization', e);
      break;
    case 'addgroupapp':
      emit('addgroupapp', e);
      break;
    case 'chooseaddress':
      emit('chooseaddress', e);
      break;
    case 'chooseinvoicetitle':
      emit('chooseinvoicetitle', e);
      break;
    case 'subscribe':
      emit('subscribe', e);
      break;
    case 'login':
      emit('login', e);
      break;
    case 'im':
      emit('im', e);
      break;
  }
}
</script>

<template>
  <button
    :id="id"
    :class="cls"
    :style="style"
    :disabled="isNativeDisabled"
    :form-type="formType"
    :open-type="openType"
    :hover-class="hoverClass"
    :hover-start-time="hoverStartTime"
    :hover-stay-time="hoverStayTime"
    :app-parameter="appParameter"
    :lang="lang"
    :session-from="sessionFrom"
    :send-message-title="sendMessageTitle"
    :send-message-path="sendMessagePath"
    :send-message-img="sendMessageImg"
    :show-message-card="showMessageCard"
    :group-id="groupId"
    :guild-id="guildId"
    :public-id="publicId"
    :scope="scope"
    @tap="onClick"
    @getuserinfo="emitNativeEvent('getuserinfo', $event)"
    @getphonenumber="emitNativeEvent('getphonenumber', $event)"
    @getrealtimephonenumber="emitNativeEvent('getrealtimephonenumber', $event)"
    @error="emitNativeEvent('error', $event)"
    @opensetting="emitNativeEvent('opensetting', $event)"
    @launchapp="emitNativeEvent('launchapp', $event)"
    @contact="emitNativeEvent('contact', $event)"
    @chooseavatar="emitNativeEvent('chooseavatar', $event)"
    @agreeprivacyauthorization="emitNativeEvent('agreeprivacyauthorization', $event)"
    @addgroupapp="emitNativeEvent('addgroupapp', $event)"
    @chooseaddress="emitNativeEvent('chooseaddress', $event)"
    @chooseinvoicetitle="emitNativeEvent('chooseinvoicetitle', $event)"
    @subscribe="emitNativeEvent('subscribe', $event)"
    @login="emitNativeEvent('login', $event)"
    @im="emitNativeEvent('im', $event)"
  >
    <view v-if="loading" class="lk-button__loader" />
    <lk-icon v-if="icon && !loading" class="lk-button__icon" :name="icon" />
    <slot />
    <view v-if="isRippleEnabled" class="lk-ripple__wave" :style="rippleWaveStyle" />
  </button>
</template>

<style lang="scss" scoped>
@use './index.scss';
</style>
