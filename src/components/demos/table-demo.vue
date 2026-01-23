<template>
  <view class="component-demo">
    <demo-block title="卡片模式（移动端推荐）">
      <lk-table
        mode="card"
        :columns="orderColumns"
        :data="orderData"
        :actions="actions"
        row-key="id"
        expandable
        @action="handleAction"
        @selection-change="handleSelection"
      >
        <template #summary>
          <view class="custom-summary">
            <text class="summary-label">已选订单：</text>
            <text class="summary-count">{{ selectedOrders.length }}</text>
            <text class="summary-label">，总金额：</text>
            <text class="summary-amount">¥{{ totalAmount }}</text>
          </view>
        </template>
      </lk-table>
    </demo-block>

    <demo-block title="传统表格模式">
      <lk-table mode="table" :columns="columns" :data="data" stripe border />
    </demo-block>

    <demo-block title="可选择表格">
      <lk-table
        mode="table"
        :columns="columns"
        :data="data"
        selection
        row-key="name"
        @selection-change="onTableSelect"
      />
    </demo-block>

    <demo-block title="加载与空状态">
      <view class="demo-actions">
        <text class="demo-btn" @click="toggleLoading">
          {{ loading ? '关闭加载' : '显示加载' }}
        </text>
        <text class="demo-btn" @click="toggleEmpty">
          {{ isEmpty ? '显示数据' : '显示空状态' }}
        </text>
      </view>
      <lk-table
        mode="card"
        :columns="columns"
        :data="isEmpty ? [] : data"
        :loading="loading"
        empty-text="暂无数据"
      />
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import LkTable from '@/uni_modules/lucky-ui/components/lk-table/lk-table.vue'
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue'

// 订单数据示例 - 卡片模式
const orderColumns = ref([
  { key: 'orderNo', prop: 'orderNo', label: '订单号', primary: true },
  { key: 'product', prop: 'product', label: '商品' },
  { key: 'amount', prop: 'amount', label: '金额' },
  { key: 'status', prop: 'status', label: '状态' },
  { key: 'createTime', prop: 'createTime', label: '下单时间' },
  { key: 'remark', prop: 'remark', label: '备注' },
])

const orderData = ref([
  {
    id: '1',
    orderNo: 'ORD20240101001',
    product: 'iPhone 15 Pro Max 256G 暗钛色',
    amount: '¥9,999',
    status: '待发货',
    createTime: '2024-01-01 10:30',
    remark: '送货前电话联系',
  },
  {
    id: '2',
    orderNo: 'ORD20240101002',
    product: 'MacBook Pro 14寸 M3芯片',
    amount: '¥14,999',
    status: '已完成',
    createTime: '2024-01-02 15:20',
    remark: '',
  },
  {
    id: '3',
    orderNo: 'ORD20240101003',
    product: 'AirPods Pro 2代',
    amount: '¥1,899',
    status: '已退款',
    createTime: '2024-01-03 09:00',
    remark: '质量问题退货',
  },
])

const actions = ref([
  { key: 'detail', text: '详情', type: 'primary' },
  { key: 'delete', text: '删除', type: 'danger' },
])

const selectedOrders = ref<string[]>([])

const totalAmount = computed(() => {
  const selected = orderData.value.filter((item) => selectedOrders.value.includes(item.id))
  return selected.reduce((sum, item) => {
    const amount = parseFloat(item.amount.replace(/[¥,]/g, ''))
    return sum + amount
  }, 0)
})

const handleAction = (action: { action: string; row: Record<string, unknown> }) => {
  uni.showToast({
    title: `${action.action}: ${action.row.orderNo}`,
    icon: 'none',
  })
}

const handleSelection = (selection: string[]) => {
  selectedOrders.value = selection
}

// 基础表格数据
const columns = ref([
  { key: 'name', prop: 'name', label: '姓名', width: '150', primary: true },
  { key: 'age', prop: 'age', label: '年龄', width: '120' },
  { key: 'address', prop: 'address', label: '地址', width: '280' },
])

const data = ref([
  { name: '张三', age: 25, address: '北京市朝阳区望京' },
  { name: '李四', age: 30, address: '上海市浦东新区陆家嘴' },
  { name: '王五', age: 28, address: '广州市天河区珠江新城' },
])

const onTableSelect = (selection: string[]) => {
  console.log('Table selected:', selection)
}

// 加载状态
const loading = ref(false)
const isEmpty = ref(false)

const toggleLoading = () => {
  loading.value = !loading.value
}

const toggleEmpty = () => {
  isEmpty.value = !isEmpty.value
}
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.demo-actions {
  display: flex;
  gap: 24rpx;
  margin-bottom: 24rpx;
}

.demo-btn {
  padding: 16rpx 32rpx;
  background: var(--lk-color-primary);
  color: #fff;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.custom-summary {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.summary-label {
  font-size: 28rpx;
  color: var(--lk-color-text-secondary);
}

.summary-count {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--lk-color-primary);
}

.summary-amount {
  font-size: 32rpx;
  font-weight: 600;
  color: #ff4d4f;
}
</style>
