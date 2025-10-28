<template>
	<view class="component-demo">
		<demo-block title="基础用法">
			<view class="demo-row">
				<lk-tooltip content="这是一段提示信息">
					<lk-button>悬停看看</lk-button>
				</lk-tooltip>

				<lk-tooltip content="点击触发" trigger="click">
					<lk-button>点击看看</lk-button>
				</lk-tooltip>
			</view>
		</demo-block>
			<demo-block title="自定义内容">
				<view class="demo-row">
					<lk-tooltip trigger="click">
						<lk-button>自定义内容（点击打开）</lk-button>
						<template #content>
							<view style="display:flex; align-items:center; gap: 12rpx;">
								<view style="width: 20rpx; height: 20rpx; border-radius: 50%; background:#16a34a;" />
								<text>一段可自定义的内容，包含图形和文字</text>
							</view>
						</template>
					</lk-tooltip>
				</view>
			</demo-block>

			<demo-block title="设置宽度">
				<view class="demo-row">
					<lk-tooltip content="固定 260rpx 宽度" :width="260">
						<lk-button>width=260</lk-button>
					</lk-tooltip>
					<lk-tooltip :width="'50%'">
						<lk-button>width=50%</lk-button>
						<template #content>
							<view>
								<text>我占容器的一半宽度，适合展示较多信息。</text>
							</view>
						</template>
					</lk-tooltip>
				</view>
			</demo-block>

		<demo-block title="位置（placement）">
			<view class="demo-grid">
				<lk-tooltip content="Top" placement="top"><lk-button>Top</lk-button></lk-tooltip>
				<lk-tooltip content="Right" placement="right"><lk-button>Right</lk-button></lk-tooltip>
				<lk-tooltip content="Bottom" placement="bottom"><lk-button>Bottom</lk-button></lk-tooltip>
				<lk-tooltip content="Left" placement="left"><lk-button>Left</lk-button></lk-tooltip>
			</view>
		</demo-block>

		<demo-block title="手动控制">
			<view class="demo-row">
				<lk-tooltip :model-value="manualOpen" trigger="manual" content="手动开关的提示">
					<lk-button @click="manualOpen = !manualOpen">
						{{ manualOpen ? '关闭' : '打开' }}
					</lk-button>
				</lk-tooltip>
			</view>
		</demo-block>

		<demo-block title="禁用与间距">
			<view class="demo-row">
				<lk-tooltip content="已禁用" :disabled="true">
					<lk-button disabled>禁用</lk-button>
				</lk-tooltip>

				<lk-tooltip content="更远的间距" :offset="16">
					<lk-button>offset 16rpx</lk-button>
				</lk-tooltip>
			</view>
		</demo-block>
			<demo-block title="初次展开一次（可关闭）">
				<view class="demo-row">
					<lk-tooltip content="默认展开，点击可关闭" trigger="click" :default-open="true">
						<lk-button>默认展开（defaultOpen）</lk-button>
					</lk-tooltip>
				</view>
			</demo-block>
		<demo-block title="常驻显示">
			<view class="demo-row">
				<lk-tooltip content="我会一直显示" always>
					<lk-button>常驻（always）</lk-button>
				</lk-tooltip>
			</view>
		</demo-block>

	</view>
  
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkTooltip from '@/uni_modules/lucky-ui/components/lk-tooltip/lk-tooltip.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const manualOpen = ref(false);
</script>

<style scoped lang="scss">
.component-demo { display: flex; flex-direction: column; gap: 24rpx; }
.demo-row { display: flex; align-items: center; flex-wrap: wrap; gap: 16rpx; }
.demo-grid {
	display: grid;
	grid-template-columns: repeat(4, max-content);
	gap: 16rpx 24rpx;
	align-items: center;
}
</style>

