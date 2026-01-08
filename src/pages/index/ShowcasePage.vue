<template>
  <scroll-view :style="{ height: contentHeight }" scroll-y>
    <lk-notice-bar
      text="工单工作台：真实业务流（加载 → 看板 → 列表 → 详情弹层 → 动作面板/对话框 → 轻提示/幕帘）"
      scrollable
      left-icon="info"
    />

    <lk-space direction="vertical" :gap="16" fill>
      <lk-card title="今日看板" shadow="base">
        <lk-skeleton v-if="loading" avatar title :rows="2" />
        <lk-grid v-else :columns="3" :border="false">
          <lk-space direction="vertical" align="center" :gap="8">
            <lk-number-roller :value="kpi.todayNew" :digit-height="32" color="var(--lk-color-primary)" />
            <text>新增工单</text>
          </lk-space>
          <lk-space direction="vertical" align="center" :gap="8">
            <lk-number-roller :value="kpi.pending" :digit-height="32" color="var(--lk-color-warning)" />
            <text>待处理</text>
          </lk-space>
          <lk-space direction="vertical" align="center" :gap="8">
            <lk-number-roller :value="kpi.sla" :digit-height="32" color="var(--lk-color-success)" />
            <text>SLA(%)</text>
          </lk-space>
        </lk-grid>
      </lk-card>

      <lk-card title="工单分类占比" shadow="base">
        <lk-skeleton v-if="loading" title :rows="3" />
        <lk-space v-else direction="vertical" :gap="12" fill>
          <lk-chart-pie :data="categoryPie" />
          <lk-segmented v-model="timeRange" :options="timeRangeOptions" />
        </lk-space>
      </lk-card>

      <lk-card title="待处理工单" shadow="base">
        <lk-skeleton v-if="loading" title :rows="4" />
        <lk-space v-else direction="vertical" :gap="12" fill>
          <lk-table :columns="ticketColumns" :data="pagedTickets" @row-click="openTicketDetail" />
          <lk-pagination v-model="page" :total="filteredTickets.length" :page-size="pageSize" />
          <lk-grid :columns="3" :gap="12">
            <lk-button variant="solid" block @click="openCreateTicket">新建工单</lk-button>
            <lk-button variant="outline" block @click="startBatchAssign">批量分配</lk-button>
            <lk-button variant="text" block @click="openCampaign">活动公告</lk-button>
          </lk-grid>
        </lk-space>
      </lk-card>

      <lk-card title="排班与约定" shadow="base">
        <lk-skeleton v-if="loading" title :rows="3" />
        <lk-space v-else direction="vertical" :gap="12" fill>
          <lk-calendar v-model="dutyDate" type="single" value-type="string" @change="handleDutyChange" />
          <lk-cell title="当天值班" :value="dutyOwner" />
          <lk-cell title="创建日程" is-link @click="showSchedulePopup = true" />
        </lk-space>
      </lk-card>

      <lk-divider text="以上均为真实业务链路演示" />
    </lk-space>

    <lk-toast-manager />

    <lk-popup
      v-model="showProcessing"
      position="center"
      round
      title="处理中"
      :overlay="true"
      :close-on-overlay="false"
      animation-type="zoom-in"
    >
      <lk-loading variant="spinner" vertical text="正在分配，请稍候" />
    </lk-popup>

    <lk-popup
      v-model="showDetailPopup"
      position="bottom"
      round
      title="工单详情"
      :animation-type="detailPopupAnimation"
    >
      <lk-space direction="vertical" :gap="12" fill>
        <lk-cell title="工单号" :value="activeTicket?.code || ''" />
        <lk-cell title="标题" :value="activeTicket?.title || ''" />
        <lk-cell title="分类" :value="activeTicket?.category || ''" />
        <lk-cell title="优先级" :value="activeTicket?.priority || ''" />
        <lk-cell title="状态" :value="activeTicket?.status || ''" />
        <lk-cell title="截止" :value="activeTicket?.due || ''" />

        <lk-grid :columns="3" :gap="12">
          <lk-button variant="outline" block @click="showActionSheet = true">处理</lk-button>
          <lk-button variant="solid" block @click="showResolveModal = true">解决</lk-button>
          <lk-button variant="text" block @click="toggleDetailAnimation">切换动画</lk-button>
        </lk-grid>
      </lk-space>
    </lk-popup>

    <lk-popup v-model="showCreatePopup" position="bottom" round title="新建工单" animation-type="slide-up">
      <lk-space direction="vertical" :gap="12" fill>
        <lk-input v-model="createForm.title" placeholder="请输入标题" />
        <lk-textarea v-model="createForm.desc" placeholder="请输入问题描述" :maxlength="200" show-word-limit />
        <lk-cell title="选择地区" :value="createRegionText" is-link @click="showAreaPicker = true" />
        <lk-cell title="选择截止日期" :value="createForm.due" is-link @click="showDatePicker = true" />
        <lk-upload v-model="createForm.files" :max="3" />
        <lk-button variant="solid" block @click="submitCreate">提交</lk-button>
      </lk-space>
    </lk-popup>

    <lk-action-sheet
      v-model="showActionSheet"
      title="工单处理"
      :description="'选择下一步动作'"
      :actions="ticketActions"
      @select="handleTicketAction"
      @cancel="openToast('已取消', 'fade')"
    />

    <lk-modal v-model="showResolveModal" title="确认解决">
      <lk-space direction="vertical" :gap="12" fill>
        <text>确认将该工单标记为已解决？</text>
        <text>解决后会记录处理日志并通知用户。</text>
      </lk-space>
      <template #footer>
        <lk-space justify="end" :gap="12" fill>
          <lk-button size="sm" variant="outline" @click="showResolveModal = false">取消</lk-button>
          <lk-button size="sm" variant="solid" @click="confirmResolve">确定</lk-button>
        </lk-space>
      </template>
    </lk-modal>

    <lk-popup v-model="showSchedulePopup" position="bottom" round title="创建日程" animation-type="slide-up">
      <lk-space direction="vertical" :gap="12" fill>
        <lk-cell title="日期" :value="dutyDate" />
        <lk-input v-model="scheduleTitle" placeholder="日程标题" />
        <lk-button variant="solid" block @click="createSchedule">保存</lk-button>
      </lk-space>
    </lk-popup>

    <lk-date-picker
      v-model="showDatePicker"
      :value="datePickerValue"
      type="date"
      title="选择截止日期"
      @confirm="handleDateConfirm"
    />

    <lk-area-picker v-model="areaValue" v-model:visible="showAreaPicker" @confirm="handleAreaConfirm" />

    <lk-curtain
      v-model:show="showCurtain"
      image-url="https://picsum.photos/600/800"
      close-position="bottom"
      @click="openToast('查看活动详情', 'zoom-in')"
      @close="openToast('已关闭活动', 'fade')"
    />
  </scroll-view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { toastStore } from '@/uni_modules/lucky-ui/components/lk-toast/toast-manager';
import type { ToastPosition, ToastTransitionName } from '@/uni_modules/lucky-ui/components/lk-toast/toast.props';
import type { Action } from '@/uni_modules/lucky-ui/components/lk-action-sheet/action-sheet.props';

import LkNoticeBar from '@/uni_modules/lucky-ui/components/lk-notice-bar/lk-notice-bar.vue';
import LkSpace from '@/uni_modules/lucky-ui/components/lk-space/lk-space.vue';
import LkCard from '@/uni_modules/lucky-ui/components/lk-card/lk-card.vue';
import LkGrid from '@/uni_modules/lucky-ui/components/lk-grid/lk-grid.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkDivider from '@/uni_modules/lucky-ui/components/lk-divider/lk-divider.vue';

import LkChartPie from '@/uni_modules/lucky-ui/components/lk-chart-pie/lk-chart-pie.vue';
import LkTable from '@/uni_modules/lucky-ui/components/lk-table/lk-table.vue';
import LkPagination from '@/uni_modules/lucky-ui/components/lk-pagination/lk-pagination.vue';
import LkSegmented from '@/uni_modules/lucky-ui/components/lk-segmented/lk-segmented.vue';

import LkLoading from '@/uni_modules/lucky-ui/components/lk-loading/lk-loading.vue';
import LkSkeleton from '@/uni_modules/lucky-ui/components/lk-skeleton/lk-skeleton.vue';

import LkModal from '@/uni_modules/lucky-ui/components/lk-modal/lk-modal.vue';
import LkPopup from '@/uni_modules/lucky-ui/components/lk-popup/lk-popup.vue';
import LkActionSheet from '@/uni_modules/lucky-ui/components/lk-action-sheet/lk-action-sheet.vue';
import LkCurtain from '@/uni_modules/lucky-ui/components/lk-curtain/lk-curtain.vue';

import LkCalendar from '@/uni_modules/lucky-ui/components/lk-calendar/lk-calendar.vue';
import LkCell from '@/uni_modules/lucky-ui/components/lk-cell/lk-cell.vue';
import LkToastManager from '@/uni_modules/lucky-ui/components/lk-toast/lk-toast-manager.vue';

import LkNumberRoller from '@/uni_modules/lucky-ui/components/lk-number-roller/lk-number-roller.vue';
import LkInput from '@/uni_modules/lucky-ui/components/lk-input/lk-input.vue';
import LkTextarea from '@/uni_modules/lucky-ui/components/lk-textarea/lk-textarea.vue';
import LkUpload from '@/uni_modules/lucky-ui/components/lk-upload/lk-upload.vue';
import LkDatePicker from '@/uni_modules/lucky-ui/components/lk-date-picker/lk-date-picker.vue';
import LkAreaPicker from '@/uni_modules/lucky-ui/components/lk-area-picker/lk-area-picker.vue';

defineProps<{ contentHeight: string }>();

type TicketStatus = '待处理' | '处理中' | '已解决';
type TicketPriority = 'P0' | 'P1' | 'P2';

interface Ticket {
  id: number;
  code: string;
  title: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  due: string;
}

const loading = ref(true);

const timeRange = ref<'today' | '7d' | '30d'>('today');
const timeRangeOptions = [
  { label: '今日', value: 'today' },
  { label: '近7天', value: '7d' },
  { label: '近30天', value: '30d' },
];

const kpi = ref({ todayNew: 0, pending: 0, sla: 0 });

const tickets = ref<Ticket[]>([]);
const page = ref(1);
const pageSize = 5;

const filteredTickets = computed(() => {
  // 真实项目里会按 timeRange + 搜索条件过滤；这里简化为返回全部
  return tickets.value;
});

const pagedTickets = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filteredTickets.value.slice(start, start + pageSize);
});

const ticketColumns = [
  { title: '工单号', key: 'code', width: 180 },
  { title: '标题', key: 'title', width: 260 },
  { title: '状态', key: 'status', width: 140 },
  { title: '截止', key: 'due', width: 180 },
];

const categoryPie = computed(() => {
  // 真实项目会由服务端返回；这里从 tickets 聚合生成
  const map = new Map<string, number>();
  for (const t of tickets.value) map.set(t.category, (map.get(t.category) || 0) + 1);
  const colorPool = [
    'var(--lk-color-primary)',
    'var(--lk-color-success)',
    'var(--lk-color-warning)',
    'var(--lk-color-danger)',
  ];
  return Array.from(map.entries()).map(([label, value], i) => ({
    label,
    value,
    color: colorPool[i % colorPool.length],
  }));
});

const showDetailPopup = ref(false);
const activeTicket = ref<Ticket | null>(null);
const detailPopupAnimation = ref<'slide-up' | 'fade' | 'zoom-in'>('slide-up');

const showActionSheet = ref(false);
const ticketActions: Action[] = [
  { name: '分配给我' },
  { name: '转为处理中' },
  { name: '添加备注' },
  { name: '关闭工单', color: 'var(--lk-color-danger)' },
];

const showResolveModal = ref(false);
const showProcessing = ref(false);

const showCurtain = ref(false);

const dutyDate = ref('');
const dutyOwner = ref('');
const showSchedulePopup = ref(false);
const scheduleTitle = ref('');

const showCreatePopup = ref(false);
const showDatePicker = ref(false);
const showAreaPicker = ref(false);

const datePickerValue = ref<Date | null>(null);
const areaValue = ref<string[]>([]);
const createRegionText = computed(() => (areaValue.value.length ? areaValue.value.join(' / ') : ''));

interface CreateForm {
  title: string;
  desc: string;
  due: string;
  files: string[];
}

const createForm = ref<CreateForm>({
  title: '',
  desc: '',
  due: '',
  files: [],
});

onMounted(() => {
  // 模拟真实请求：先展示骨架屏，再填充数据
  setTimeout(() => {
    kpi.value = { todayNew: 18, pending: 7, sla: 96 };
    tickets.value = [
      { id: 1, code: 'TK20260102001', title: '支付回调偶发超时', category: '支付', priority: 'P0', status: '待处理', due: '2026-01-02' },
      { id: 2, code: 'TK20260102002', title: 'H5 页面白屏排查', category: '前端', priority: 'P1', status: '处理中', due: '2026-01-03' },
      { id: 3, code: 'TK20260102003', title: '上传组件兼容性问题', category: '组件库', priority: 'P1', status: '待处理', due: '2026-01-03' },
      { id: 4, code: 'TK20260102004', title: '统计报表数据延迟', category: '数据', priority: 'P2', status: '待处理', due: '2026-01-05' },
      { id: 5, code: 'TK20260102005', title: '用户反馈：登录验证码收不到', category: '账号', priority: 'P0', status: '待处理', due: '2026-01-02' },
      { id: 6, code: 'TK20260102006', title: '表格组件列宽自适应优化', category: '组件库', priority: 'P2', status: '已解决', due: '2026-01-01' },
      { id: 7, code: 'TK20260102007', title: '弹层拖拽手势冲突', category: '交互', priority: 'P1', status: '处理中', due: '2026-01-04' },
    ];
    dutyDate.value = '2026-01-02';
    dutyOwner.value = '张三 / 15:00-23:00';
    loading.value = false;
  }, 1000);
});

function openToast(
  message: string,
  transition: ToastTransitionName = 'slide-up',
  position: ToastPosition = 'center'
) {
  toastStore.show({ message, transition, position, duration: 1800 });
}

function openCreateTicket() {
  showCreatePopup.value = true;
}

function startBatchAssign() {
  showProcessing.value = true;
  setTimeout(() => {
    showProcessing.value = false;
    openToast('已完成批量分配', 'slide-up');
  }, 1200);
}

function openCampaign() {
  showCurtain.value = true;
}

function openTicketDetail(row: Ticket) {
  activeTicket.value = row;
  showDetailPopup.value = true;
}

function handleDutyChange(v: unknown) {
  dutyDate.value = String(v);
  openToast(`已切换到 ${dutyDate.value}`, 'fade');
}

function createSchedule() {
  showSchedulePopup.value = false;
  openToast('日程已创建', 'zoom-in');
  scheduleTitle.value = '';
}

function toggleDetailAnimation() {
  detailPopupAnimation.value =
    detailPopupAnimation.value === 'slide-up'
      ? 'fade'
      : detailPopupAnimation.value === 'fade'
        ? 'zoom-in'
        : 'slide-up';
  openToast(`详情动画：${detailPopupAnimation.value}`, 'fade');
}

function handleTicketAction(payload: { action: Action; index: number }) {
  const name = payload.action.name;
  showActionSheet.value = false;
  if (name === '关闭工单') {
    showResolveModal.value = true;
    return;
  }
  openToast(`已执行：${name}`, 'slide-up');
}

function confirmResolve() {
  showResolveModal.value = false;
  openToast('工单已标记为已解决', 'zoom-in');
}

function formatDate(d: Date) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const dd = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function handleDateConfirm(v: Date | [Date, Date] | Date[] | null) {
  if (v instanceof Date) {
    datePickerValue.value = v;
    createForm.value.due = formatDate(v);
  }
  showDatePicker.value = false;
}

function handleAreaConfirm(_v: string[]) {
  // v-model 已同步 areaValue，这里只负责收口
  showAreaPicker.value = false;
}

function submitCreate() {
  if (!createForm.value.title) {
    openToast('请输入标题', 'fade');
    return;
  }
  showCreatePopup.value = false;
  openToast('工单已提交', 'slide-up');
  // 真实项目里此处会调用接口并刷新列表
  createForm.value = { title: '', desc: '', due: '', files: [] };
  datePickerValue.value = null;
  areaValue.value = [];
}
</script>
