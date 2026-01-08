<template>
  <view class="todo-page">
    <lk-navbar title="待办清单" left-arrow @click-left="handleBack">
      <template #right>
        <lk-icon name="plus" size="40" color="var(--lk-color-primary)" @click="showAddPopup = true" />
      </template>
    </lk-navbar>

    <lk-sticky :offset-top="0">
      <view style="padding: 20rpx 24rpx; background-color: var(--lk-color-bg-surface); border-bottom: 1rpx solid var(--lk-color-border-light);">
        <lk-space :gap="16" fill>
          <lk-input v-model="searchQuery" placeholder="搜索任务..." prefix-icon="search" clearable style="flex: 1;" />
          <lk-dropdown v-model="filterStatus">
            <lk-button size="sm" plain>
              {{ statusOptions.find(o => o.value === filterStatus)?.label }}
              <lk-icon name="arrow-down" size="24" style="margin-left: 8rpx;" />
            </lk-button>
            <template #menu>
              <lk-dropdown-item v-for="opt in statusOptions" :key="opt.value" :name="opt.value">
                {{ opt.label }}
              </lk-dropdown-item>
            </template>
          </lk-dropdown>
        </lk-space>
      </view>
    </lk-sticky>

    <scroll-view class="todo-page__scroll" scroll-y>
      <lk-space direction="vertical" :gap="20" fill style="padding: 24rpx; padding-bottom: calc(24rpx + env(safe-area-inset-bottom));">

        <!-- 统计概览 -->
        <lk-grid :columns="3" :border="false">
          <lk-card shadow="never" :border="true" padding="16rpx">
            <lk-space direction="vertical" align="center" :gap="8">
              <text style="font-size: 32rpx; font-weight: bold; color: var(--lk-color-primary);">{{ todoList.length }}</text>
              <text style="font-size: 22rpx; color: var(--lk-color-text-secondary);">全部</text>
            </lk-space>
          </lk-card>
          <lk-card shadow="never" :border="true" padding="16rpx">
            <lk-space direction="vertical" align="center" :gap="8">
              <text style="font-size: 32rpx; font-weight: bold; color: var(--lk-color-warning);">{{ pendingCount }}</text>
              <text style="font-size: 22rpx; color: var(--lk-color-text-secondary);">进行中</text>
            </lk-space>
          </lk-card>
          <lk-card shadow="never" :border="true" padding="16rpx">
            <lk-space direction="vertical" align="center" :gap="8">
              <text style="font-size: 32rpx; font-weight: bold; color: var(--lk-color-success);">{{ completedCount }}</text>
              <text style="font-size: 22rpx; color: var(--lk-color-text-secondary);">已完成</text>
            </lk-space>
          </lk-card>
        </lk-grid>

        <!-- 任务列表 -->
        <view v-for="(item, index) in filteredList" :key="item.id">
          <lk-card shadow="base" padding="24rpx">
            <lk-space direction="vertical" :gap="20" fill>
              <lk-space justify="between" align="start" fill>
                <lk-space :gap="16" align="center">
                  <lk-checkbox v-model="item.completed" shape="circle" @change="handleStatusChange(item)" />
                  <text
:style="{
                    fontSize: '30rpx',
                    fontWeight: 'bold',
                    color: item.completed ? 'var(--lk-color-text-placeholder)' : 'var(--lk-color-text-primary)',
                    textDecoration: item.completed ? 'line-through' : 'none'
                  }">{{ item.title }}</text>
                </lk-space>
                <lk-tag
                  type="light"
                  size="sm"
                  :bg-color="getPriorityBg(item.priority)"
                  :text-color="getPriorityColor(item.priority)"
                >{{ getPriorityLabel(item.priority) }}</lk-tag>
              </lk-space>

              <text style="font-size: 26rpx; color: var(--lk-color-text-regular);">{{ item.desc }}</text>

              <lk-space direction="vertical" :gap="12" fill>
                <lk-space justify="between" fill>
                  <text style="font-size: 24rpx; color: var(--lk-color-text-secondary);">进度: {{ item.progress }}%</text>
                  <text style="font-size: 24rpx; color: var(--lk-color-text-secondary);">截止: {{ item.dueDate }}</text>
                </lk-space>
                <lk-progress :percentage="item.progress" :color="getPriorityColor(item.priority)" stroke-width="8" />
              </lk-space>

              <lk-divider />

              <lk-space justify="between" align="center" fill>
                <lk-space :gap="8">
                  <lk-tag v-for="tag in item.tags" :key="tag" plain size="sm">{{ tag }}</lk-tag>
                </lk-space>
                <lk-space :gap="24">
                  <lk-icon name="edit" size="32" color="var(--lk-color-text-secondary)" @click="handleEdit(item)" />
                  <lk-icon name="delete" size="32" color="var(--lk-color-danger)" @click="handleDelete(item)" />
                </lk-space>
              </lk-space>
            </lk-space>
          </lk-card>
        </view>

        <lk-divider v-if="filteredList.length > 0" text="没有更多任务了" />
        <view v-else style="padding: 100rpx 0; text-align: center;">
          <lk-icon name="info" size="120" color="var(--lk-color-text-placeholder)" />
          <view style="margin-top: 20rpx; color: var(--lk-color-text-placeholder);">暂无相关任务</view>
        </view>
      </lk-space>
    </scroll-view>

    <!-- 新增/编辑弹窗 -->
    <lk-popup v-model:show="showAddPopup" position="bottom" round title="添加新任务" height="85vh">
      <view style="padding: 32rpx;">
        <lk-form ref="formRef" :model="formModel" label-width="160">
          <lk-space direction="vertical" :gap="32" fill>
            <lk-input v-model="formModel.title" label="任务名称" placeholder="请输入任务名称" required />

            <lk-textarea v-model="formModel.desc" label="任务描述" placeholder="请输入详细描述" :maxlength="200" show-word-limit />

            <view class="form-item">
              <text class="label">优先级</text>
              <lk-tooltip content="1: 低, 2: 中, 3: 高">
                <lk-rate v-model="formModel.priority" :count="3" active-color="var(--lk-color-danger)" />
              </lk-tooltip>
              <text style="margin-left: 20rpx; font-size: 24rpx; color: var(--lk-color-text-secondary);">
                {{ getPriorityLabel(formModel.priority) }}
              </text>
            </view>

            <view class="form-item">
              <text class="label">预计工时 (h)</text>
              <lk-stepper v-model="formModel.estimatedHours" :min="1" :max="24" />
            </view>

            <view class="form-item">
              <text class="label">附件</text>
              <lk-upload v-model:file-list="formModel.files" :max-count="3" />
            </view>

            <view class="form-item">
              <text class="label">当前进度</text>
              <view style="flex: 1; padding: 0 20rpx;">
                <lk-slider v-model="formModel.progress" :step="5" show-value />
              </view>
            </view>

            <lk-cell title="截止日期" :value="formModel.dueDate || '请选择'" is-link @click="showDatePicker = true" />

            <view class="form-item">
              <text class="label">任务分类</text>
              <lk-radio-group v-model="formModel.category" direction="horizontal">
                <lk-radio label="work">工作</lk-radio>
                <lk-radio label="life">生活</lk-radio>
                <lk-radio label="study">学习</lk-radio>
              </lk-radio-group>
            </view>

            <view class="form-item">
              <text class="label">提醒我</text>
              <lk-switch v-model="formModel.reminder" />
            </view>

            <lk-button type="primary" block @click="handleSubmit">保存任务</lk-button>
          </lk-space>
        </lk-form>
      </view>
    </lk-popup>

    <!-- 日期选择器 -->
    <lk-date-picker
      v-model:show="showDatePicker"
      type="date"
      title="选择截止日期"
      @confirm="handleDateConfirm"
    />

    <lk-toast ref="toastRef" />

    <!-- 庆祝幕帘 -->
    <lk-curtain
      v-model:show="showCelebration"
      image-url="https://img.yzcdn.cn/vant/apple-1.jpg"
      width="600"
      height="800"
      @click="showCelebration = false"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import LkNavbar from '@/uni_modules/lucky-ui/components/lk-navbar/lk-navbar.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import LkSpace from '@/uni_modules/lucky-ui/components/lk-space/lk-space.vue';
import LkInput from '@/uni_modules/lucky-ui/components/lk-input/lk-input.vue';
import LkCard from '@/uni_modules/lucky-ui/components/lk-card/lk-card.vue';
import LkGrid from '@/uni_modules/lucky-ui/components/lk-grid/lk-grid.vue';
import LkCheckbox from '@/uni_modules/lucky-ui/components/lk-checkbox/lk-checkbox.vue';
import LkTag from '@/uni_modules/lucky-ui/components/lk-tag/lk-tag.vue';
import LkProgress from '@/uni_modules/lucky-ui/components/lk-progress/lk-progress.vue';
import LkDivider from '@/uni_modules/lucky-ui/components/lk-divider/lk-divider.vue';
import LkPopup from '@/uni_modules/lucky-ui/components/lk-popup/lk-popup.vue';
import LkDropdown from '@/uni_modules/lucky-ui/components/lk-dropdown/lk-dropdown.vue';
import LkDropdownItem from '@/uni_modules/lucky-ui/components/lk-dropdown/lk-dropdown-item.vue';
import LkForm from '@/uni_modules/lucky-ui/components/lk-form/lk-form.vue';
import LkTextarea from '@/uni_modules/lucky-ui/components/lk-textarea/lk-textarea.vue';
import LkRate from '@/uni_modules/lucky-ui/components/lk-rate/lk-rate.vue';
import LkSlider from '@/uni_modules/lucky-ui/components/lk-slider/lk-slider.vue';
import LkCell from '@/uni_modules/lucky-ui/components/lk-cell/lk-cell.vue';
import LkRadioGroup from '@/uni_modules/lucky-ui/components/lk-radio/lk-radio-group.vue';
import LkRadio from '@/uni_modules/lucky-ui/components/lk-radio/lk-radio.vue';
import LkSwitch from '@/uni_modules/lucky-ui/components/lk-switch/lk-switch.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkDatePicker from '@/uni_modules/lucky-ui/components/lk-date-picker/lk-date-picker.vue';
import LkToast from '@/uni_modules/lucky-ui/components/lk-toast/lk-toast.vue';
import LkSticky from '@/uni_modules/lucky-ui/components/lk-sticky/lk-sticky.vue';
import LkStepper from '@/uni_modules/lucky-ui/components/lk-stepper/lk-stepper.vue';
import LkTooltip from '@/uni_modules/lucky-ui/components/lk-tooltip/lk-tooltip.vue';
import LkUpload from '@/uni_modules/lucky-ui/components/lk-upload/lk-upload.vue';
import LkCurtain from '@/uni_modules/lucky-ui/components/lk-curtain/lk-curtain.vue';

const searchQuery = ref('');
const filterStatus = ref('all');
const showAddPopup = ref(false);
const showDatePicker = ref(false);
const showCelebration = ref(false);
const toastRef = ref();

const statusOptions = [
  { label: '全部', value: 'all' },
  { label: '进行中', value: 'pending' },
  { label: '已完成', value: 'completed' },
];

const todoList = ref([
  {
    id: 1,
    title: '完成 Lucky UI 文档编写',
    desc: '需要补充所有新组件的参数说明和示例代码',
    priority: 3,
    progress: 60,
    dueDate: '2023-10-25',
    completed: false,
    tags: ['工作', '紧急'],
    category: 'work',
    estimatedHours: 8,
    files: []
  },
  {
    id: 2,
    title: '健身房锻炼',
    desc: '力量训练 45 分钟 + 有氧 20 分钟',
    priority: 1,
    progress: 0,
    dueDate: '2023-10-20',
    completed: false,
    tags: ['生活'],
    category: 'life',
    estimatedHours: 2,
    files: []
  },
  {
    id: 3,
    title: '学习 Vue3 组合式 API',
    desc: '深入理解 watchEffect 和 computed 的区别',
    priority: 2,
    progress: 100,
    dueDate: '2023-10-15',
    completed: true,
    tags: ['学习'],
    category: 'study',
    estimatedHours: 4,
    files: []
  }
]);

const formModel = ref({
  title: '',
  desc: '',
  priority: 2,
  progress: 0,
  dueDate: '',
  category: 'work',
  reminder: true,
  estimatedHours: 1,
  files: []
});

const pendingCount = computed(() => todoList.value.filter(t => !t.completed).length);
const completedCount = computed(() => todoList.value.filter(t => t.completed).length);

const filteredList = computed(() => {
  return todoList.value.filter(item => {
    const matchSearch = item.title.includes(searchQuery.value) || item.desc.includes(searchQuery.value);
    const matchStatus = filterStatus.value === 'all' ||
                       (filterStatus.value === 'completed' && item.completed) ||
                       (filterStatus.value === 'pending' && !item.completed);
    return matchSearch && matchStatus;
  });
});

const handleBack = () => {
  uni.navigateBack();
};

const getPriorityLabel = (p: number) => {
  if (p >= 3) return '高优先级';
  if (p >= 2) return '中优先级';
  return '低优先级';
};

const getPriorityColor = (p: number) => {
  if (p >= 3) return 'var(--lk-color-danger)';
  if (p >= 2) return 'var(--lk-color-warning)';
  return 'var(--lk-color-primary)';
};

const getPriorityBg = (p: number) => {
  if (p >= 3) return 'var(--lk-color-danger-bg-soft)';
  if (p >= 2) return 'var(--lk-color-warning-bg-soft)';
  return 'var(--lk-color-primary-bg-soft)';
};

const handleStatusChange = (item: any) => {
  if (item.completed) {
    item.progress = 100;
    toastRef.value?.show({ message: '任务已完成！', type: 'success' });

    if (pendingCount.value === 0) {
      setTimeout(() => {
        showCelebration.value = true;
      }, 500);
    }
  } else {
    item.progress = 0;
  }
};

const handleDateConfirm = (e: any) => {
  formModel.value.dueDate = e.value;
  showDatePicker.value = false;
};

const handleSubmit = () => {
  if (!formModel.value.title) {
    toastRef.value?.show({ message: '请输入任务名称', type: 'error' });
    return;
  }

  const newTask = {
    id: Date.now(),
    ...formModel.value,
    completed: formModel.value.progress === 100,
    tags: [formModel.value.category === 'work' ? '工作' : formModel.value.category === 'life' ? '生活' : '学习']
  };

  todoList.value.unshift(newTask);
  showAddPopup.value = false;
  toastRef.value?.show({ message: '添加成功', type: 'success' });

  // 重置表单
  formModel.value = {
    title: '',
    desc: '',
    priority: 2,
    progress: 0,
    dueDate: '',
    category: 'work',
    reminder: true,
    estimatedHours: 1,
    files: []
  };
};

const handleDelete = (item: any) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除该任务吗？',
    success: (res) => {
      if (res.confirm) {
        const index = todoList.value.findIndex(t => t.id === item.id);
        todoList.value.splice(index, 1);
        toastRef.value?.show({ message: '已删除', type: 'success' });
      }
    }
  });
};

const handleEdit = (item: any) => {
  toastRef.value?.show({ message: '编辑功能开发中...', type: 'info' });
};
</script>

<style scoped lang="scss">
.todo-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--lk-color-bg-layout);
}

.todo-page__scroll {
  flex: 1;
  min-height: 0;
}

.form-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;

  .label {
    width: 160rpx;
    font-size: 28rpx;
    color: var(--lk-color-text-regular);
  }
}
</style>
