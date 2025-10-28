<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

defineOptions({ name: 'LkTooltip' });

const props = defineProps({
	// 内容文本，若未传则使用默认插槽 name="content"
	content: { type: String, default: '' },
	// 触发方式：hover | click | manual
	trigger: { type: String as () => 'hover' | 'click' | 'manual', default: 'hover' },
	// 位置：top | bottom | left | right
	placement: { type: String as () => 'top' | 'bottom' | 'left' | 'right', default: 'top' },
	// 是否显示（受控）
	modelValue: { type: Boolean, default: undefined },
	// 禁用
	disabled: { type: Boolean, default: false },
	// 常驻显示：为 true 时加载后始终显示，忽略触发与关闭逻辑
	always: { type: Boolean, default: false },
	// 初次挂载时打开一次，后续允许关闭（仅在非受控、且未禁用/常驻时生效）
		defaultOpen: { type: Boolean, default: false },
	// 与触发元素的间距（rpx）
	offset: { type: Number, default: 8 },
  // 浮层宽度：不设置则随内容自适应；可传 number(按 rpx) 或 string(如 '300rpx' | '50%')
  width: { type: [Number, String] as any, default: undefined },
	// 延时（ms）
	showDelay: { type: Number, default: 80 },
	hideDelay: { type: Number, default: 80 }
});
const emit = defineEmits(['update:modelValue', 'show', 'hide']);

const innerOpen = ref(false);
const open = computed({
	get: () => {
		if (props.always) return true;
		return props.modelValue === undefined ? innerOpen.value : props.modelValue;
	},
	set: (v: boolean) => {
		if (props.always) return; // 常驻时忽略外部变更
		if (props.modelValue === undefined) innerOpen.value = v;
		emit('update:modelValue', v);
	}
});

let showTimer: any = null;
let hideTimer: any = null;

function clearTimers() {
	if (showTimer) { clearTimeout(showTimer); showTimer = null; }
	if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
}

function doOpen(v = true) {
	if (props.disabled || props.always) return;
	if (open.value === v) return;
	open.value = v;
	emit(v ? 'show' : 'hide');
}

function onTriggerEnter() {
	if (props.always || props.trigger !== 'hover') return;
	clearTimeout(hideTimer);
	showTimer = setTimeout(() => doOpen(true), props.showDelay);
}
function onTriggerLeave() {
	if (props.always || props.trigger !== 'hover') return;
	clearTimeout(showTimer);
	hideTimer = setTimeout(() => doOpen(false), props.hideDelay);
}
function onTriggerClick() {
	if (props.always || props.trigger !== 'click') return;
	doOpen(!open.value);
}
function onContentEnter() {
	if (props.always || props.trigger !== 'hover') return;
	clearTimeout(hideTimer);
}
function onContentLeave() {
	if (props.always || props.trigger !== 'hover') return;
	hideTimer = setTimeout(() => doOpen(false), props.hideDelay);
}

watch(() => props.disabled, (v) => { if (v) doOpen(false); });

// 计算方位 class 与偏移变量
const placementClass = computed(() => `is-${props.placement}`);
const popStyle = computed(() => {
	const style: Record<string, any> = { '--lk-tooltip-offset': `${props.offset}rpx` };
	if (props.width !== undefined && props.width !== null && props.width !== '') {
		style.width = typeof props.width === 'number' ? `${props.width}rpx` : String(props.width);
	}
	return style as any;
});

onMounted(() => {
	if (props.always || props.disabled) return;
	// 仅非受控时生效
	if (props.modelValue !== undefined) return;
	if (props.defaultOpen) {
		innerOpen.value = true;
		emit('show');
	}
});
</script>

<template>
		<view class="lk-tooltip" :class="[disabled && 'is-disabled', always && 'is-always']"
				@mouseenter="onTriggerEnter" @mouseleave="onTriggerLeave" @click="onTriggerClick">
		<view class="lk-tooltip__trigger">
			<slot />
		</view>

		<view v-if="open" class="lk-tooltip__pop lk-elevated" :class="placementClass" :style="popStyle"
					@mouseenter="onContentEnter" @mouseleave="onContentLeave">
			<view class="lk-tooltip__content">
				<slot name="content">
					<text>{{ content }}</text>
				</slot>
			</view>
			<view class="lk-tooltip__arrow" />
		</view>
	</view>
  
</template>

<style scoped lang="scss">
.lk-tooltip {
	position: relative;
	display: inline-block;
	&.is-disabled { opacity: .6; pointer-events: none; }

	&__trigger { display: inline-flex; align-items: center; }

	&__pop {
		position: absolute;
		z-index: 2400;
		background: var(--lk-color-bg-surface);
		color: var(--lk-color-text);
		border: 2rpx solid var(--lk-color-border-weak);
		border-radius: var(--lk-radius-md);
		padding: 10rpx 14rpx;
		font-size: 24rpx;
		line-height: 1.4;
		box-shadow: var(--lk-shadow-base);
		animation: lk-tooltip-in .12s ease-out;

		// 默认 top
		top: auto; bottom: calc(100% + var(--lk-tooltip-offset, 8rpx)); left: 50%; transform: translateX(-50%);

		&.is-bottom { top: calc(100% + var(--lk-tooltip-offset, 8rpx)); bottom: auto; left: 50%; transform: translateX(-50%); }
		&.is-left { right: calc(100% + var(--lk-tooltip-offset, 8rpx)); left: auto; top: 50%; bottom: auto; transform: translateY(-50%); }
		&.is-right { left: calc(100% + var(--lk-tooltip-offset, 8rpx)); right: auto; top: 50%; bottom: auto; transform: translateY(-50%); }
	}

	&__content { display: block; }

	&__arrow {
		position: absolute; width: 0; height: 0; border-style: solid;
	}

	// 箭头：根据不同方向绘制
	&__pop.is-top &__arrow { /* pop 在上方，即箭头朝下，连接触发元素的上边 */
		left: 50%; bottom: -8rpx; transform: translateX(-50%);
		border-width: 8rpx 8rpx 0 8rpx;
		border-color: var(--lk-color-border-weak) transparent transparent transparent;
	}
	&__pop.is-top::after { // 内箭头填充背景，制造边框效果
		content: ""; position: absolute; left: 50%; bottom: -6rpx; transform: translateX(-50%);
		width: 0; height: 0; border-style: solid; border-width: 6rpx 6rpx 0 6rpx;
		border-color: var(--lk-color-bg-surface) transparent transparent transparent;
	}

	&__pop.is-bottom &__arrow {
		left: 50%; top: -8rpx; transform: translateX(-50%);
		border-width: 0 8rpx 8rpx 8rpx;
		border-color: transparent transparent var(--lk-color-border-weak) transparent;
	}
	&__pop.is-bottom::after {
		content: ""; position: absolute; left: 50%; top: -6rpx; transform: translateX(-50%);
		width: 0; height: 0; border-style: solid; border-width: 0 6rpx 6rpx 6rpx;
		border-color: transparent transparent var(--lk-color-bg-surface) transparent;
	}

	&__pop.is-left &__arrow {
		top: 50%; right: -8rpx; transform: translateY(-50%);
		border-width: 8rpx 0 8rpx 8rpx;
		border-color: transparent transparent transparent var(--lk-color-border-weak);
	}
	&__pop.is-left::after {
		content: ""; position: absolute; top: 50%; right: -6rpx; transform: translateY(-50%);
		width: 0; height: 0; border-style: solid; border-width: 6rpx 0 6rpx 6rpx;
		border-color: transparent transparent transparent var(--lk-color-bg-surface);
	}

	&__pop.is-right &__arrow {
		top: 50%; left: -8rpx; transform: translateY(-50%);
		border-width: 8rpx 8rpx 8rpx 0;
		border-color: transparent var(--lk-color-border-weak) transparent transparent;
	}
	&__pop.is-right::after {
		content: ""; position: absolute; top: 50%; left: -6rpx; transform: translateY(-50%);
		width: 0; height: 0; border-style: solid; border-width: 6rpx 6rpx 6rpx 0;
		border-color: transparent var(--lk-color-bg-surface) transparent transparent;
	}
}

@keyframes lk-tooltip-in { from { opacity: .4; } to { opacity: 1; } }
</style>

