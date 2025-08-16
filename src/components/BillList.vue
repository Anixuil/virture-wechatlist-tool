<template>
  <div class="bill-container">
    <!-- 状态栏 -->
    <div class="status-bar" :class="`status-${props.statusBarStyle}`">
      <span class="time">{{ currentTime }}</span>
      <div class="status-icons">
        <!-- 信号强度 -->
        <div class="signal-container">
          <div class="signal-bars">
            <div class="signal-bar" :class="{ active: signalStrength >= 1 }"></div>
            <div class="signal-bar" :class="{ active: signalStrength >= 2 }"></div>
            <div class="signal-bar" :class="{ active: signalStrength >= 3 }"></div>
            <div class="signal-bar" :class="{ active: signalStrength >= 4 }"></div>
          </div>
        </div>
        <!-- WiFi图标 -->
        <div class="wifi-container">
          <svg class="wifi-icon" viewBox="0 0 24 24" :class="{ active: wifiConnected }">
            <path
              d="M12 3C7.95 3 4.21 4.34 1.2 6.6L3 9C5.5 7.12 8.62 6 12 6C15.38 6 18.5 7.12 21 9L22.8 6.6C19.79 4.34 16.05 3 12 3Z" />
            <path
              d="M12 9C9.3 9 6.81 9.89 4.8 11.4L6.6 13.8C8.1 12.67 9.97 12 12 12C14.03 12 15.9 12.67 17.4 13.8L19.2 11.4C17.19 9.89 14.7 9 12 9Z" />
            <path d="M12 15C10.65 15 9.4 15.45 8.4 16.2L12 21L15.6 16.2C14.6 15.45 13.35 15 12 15Z" />
          </svg>
        </div>
        <!-- 电池图标 -->
        <div class="battery-container">
          <div class="battery-outline">
            <div class="battery-level" :style="{
              width: `${batteryLevel}%`,
              backgroundColor: batteryLevel > 20 ? '#000' : batteryLevel > 10 ? '#ff9500' : '#ff3b30'
            }"></div>
            <div class="battery-tip"></div>
            <span class="battery-text" :style="{
              color: '#fff',
              textShadow: batteryLevel > 20 ? '0 0 1px rgba(0,0,0,0.5)' : '0 0 2px rgba(0,0,0,0.8)'
            }">{{ Math.floor(batteryLevel) }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 头部 -->
    <div class="header">
      <div class="header-left">
        <el-button class="close-btn" @click="handleClose" type="text" size="small" :icon="Close" />
      </div>
      <div class="header-title">{{ billConfig.title || '账单' }}</div>
      <div class="header-right">
        <el-button class="menu-btn" type="text" size="small" :icon="MoreFilled" />
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-button class="filter-btn" type="text" size="small">
        <span>{{ billConfig.filterOptions?.[0] || '二维码收付款' }}</span>
        <el-icon class="qr-icon">
          <CaretBottom />
        </el-icon>
      </el-button>
      <span class="filter-divider"></span>
      <el-button class="search-btn" type="text" size="small">
        <el-icon class="search-icon">
          <Search />
        </el-icon>
        <span>{{ billConfig.filterOptions?.[1] || '查找交易' }}</span>
      </el-button>
    </div>

    <!-- 账单列表容器 -->
    <div class="bill-list-container">
      <div class="bill-list" ref="billListRef">
        <div v-for="item in billListItems"
          :key="item.type === 'header' ? `header-${(item.data as MonthlyBill).year}-${(item.data as MonthlyBill).month}` : `transaction-${(item.data as Transaction).id}`"
          class="bill-item"
          :class="{ 'month-header': item.type === 'header', 'transaction-item': item.type === 'transaction' }">
          <!-- 月度头部 -->
          <div v-if="item.type === 'header'" class="month-header-content" @click="toggleMonth(item.monthKey!)">
            <div class="month-info">
              <span class="month-text">{{ formatMonth(item.data as MonthlyBill) }}</span>
              <el-icon class="dropdown-icon" :class="{ 'expanded': expandedMonths.has(item.monthKey!) }">
                <ArrowRight />
              </el-icon>
            </div>
            <div class="month-summary">
              <span class="expense">支出¥{{ formatAmount((item.data as MonthlyBill).totalExpense) }}</span>
              <span class="income">收入¥{{ formatAmount((item.data as MonthlyBill).totalIncome) }}</span>
            </div>
          </div>

          <!-- 交易记录 -->
          <div v-else-if="item.type === 'transaction' && isMonthExpanded(item.monthKey!)" class="transaction-content">
            <div class="transaction-icon">
              <div class="icon-circle">
                <!-- <el-icon class="icon-inner">
                  <Check />
                </el-icon> -->
                <img src="@/assets/zz-icon.png" alt="">
              </div>
            </div>
            <div class="transaction-info">
              <div class="transaction-desc">
                <span>{{ (item.data as Transaction).description }}</span>
                <span>{{ (item.data as Transaction).recipient }}</span>
                <span v-if="(item.data as Transaction).emoji" class="emoji">{{ (item.data as Transaction).emoji
                  }}</span>
              </div>
              <div class="transaction-time">{{ (item.data as Transaction).date }} {{ (item.data as Transaction).time }}
              </div>
            </div>
            <div class="transaction-amount" :class="{ 'income': (item.data as Transaction).type === 'income' }">
              {{ (item.data as Transaction).type === 'income' ? '+' : '-' }}¥{{ formatAmount((item.data as
                Transaction).amount) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import type { BillConfig, MonthlyBill, Transaction, BillListItem } from '@/types/bill'
import {
  ArrowRight, Search, CaretBottom, Close, More, Check,
  MoreFilled
} from '@element-plus/icons-vue'

// Props
interface Props {
  config?: BillConfig
  configUrl?: string
  statusBarStyle?: string
}

const props = withDefaults(defineProps<Props>(), {
  config: undefined,
  configUrl: '/bill-config.json',
  statusBarStyle: 'ios'
})

// Emits
const emit = defineEmits<{
  close: []
}>()

// 响应式数据
const billConfig = ref<BillConfig>({
  title: '账单',
  filterOptions: ['二维码收付款', '查找交易'],
  monthlyBills: []
})

const expandedMonths = ref<Set<string>>(new Set())
const billListRef = ref<HTMLDivElement>()

// 状态栏相关数据
const currentTime = ref('12:16')
const signalStrength = ref(4) // 1-4级信号强度
const wifiConnected = ref(true)
const batteryLevel = ref(87)
let timeInterval: number | null = null

// 计算属性
const billListItems = computed<BillListItem[]>(() => {
  const items: BillListItem[] = []

  billConfig.value.monthlyBills.forEach(monthlyBill => {
    const monthKey = `${monthlyBill.year}-${monthlyBill.month}`

    // 计算该月的总收入和总支出
    const calculatedTotals = calculateMonthlyTotals(monthlyBill.transactions)

    // 添加月度头部（使用计算得出的总额）
    items.push({
      type: 'header',
      data: {
        ...monthlyBill,
        totalIncome: calculatedTotals.totalIncome,
        totalExpense: calculatedTotals.totalExpense
      },
      monthKey
    })

    // 添加交易记录
    monthlyBill.transactions.forEach(transaction => {
      items.push({
        type: 'transaction',
        data: transaction,
        monthKey
      })
    })
  })

  return items
})

// 方法
const loadBillConfig = async () => {
  try {
    const response = await fetch(props.configUrl)
    const config = await response.json()
    billConfig.value = config

    // 默认展开第一个月
    if (config.monthlyBills.length > 0) {
      const firstMonth = config.monthlyBills[0]
      const monthKey = `${firstMonth.year}-${firstMonth.month}`
      expandedMonths.value.add(monthKey)
    }
  } catch (error) {
    console.error('加载账单配置失败:', error)
  }
}

const updateConfig = (config: BillConfig) => {
  billConfig.value = config

  // 默认展开第一个月
  if (config.monthlyBills.length > 0) {
    const firstMonth = config.monthlyBills[0]
    const monthKey = `${firstMonth.year}-${firstMonth.month}`
    expandedMonths.value.add(monthKey)
  }
}

const toggleMonth = (monthKey: string) => {
  if (expandedMonths.value.has(monthKey)) {
    expandedMonths.value.delete(monthKey)
  } else {
    expandedMonths.value.add(monthKey)
  }
}

const isMonthExpanded = (monthKey: string) => {
  return expandedMonths.value.has(monthKey)
}

const formatMonth = (monthlyBill: MonthlyBill) => {
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ]
  return `${monthlyBill.year}年${monthNames[monthlyBill.month - 1]}`
}

const formatAmount = (amount: number) => {
  return amount.toFixed(2)
}

// 计算月度总额
const calculateMonthlyTotals = (transactions: Transaction[]) => {
  let totalIncome = 0
  let totalExpense = 0

  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      totalIncome += transaction.amount
    } else {
      totalExpense += transaction.amount
    }
  })

  return {
    totalIncome,
    totalExpense
  }
}

const handleClose = () => {
  emit('close')
}

// 更新时间
const updateTime = () => {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  currentTime.value = `${hours}:${minutes}`
}

// 模拟状态栏数据变化
const simulateStatusBar = () => {
  // 模拟信号强度变化
  // setInterval(() => {
  //   signalStrength.value = Math.floor(Math.random() * 4) + 1
  // }, 10000)

  // 模拟WiFi连接状态变化
  setInterval(() => {
    wifiConnected.value = Math.random() > 0.1
  }, 15000)

  // 模拟电池电量缓慢下降
  setInterval(() => {
    if (batteryLevel.value > 5) {
      batteryLevel.value = Math.floor(batteryLevel.value - Math.random() * 2)
    }
  }, 30000)
}

// 生命周期
onMounted(() => {
  if (props.config) {
    updateConfig(props.config)
  } else {
    loadBillConfig()
  }

  // 初始化时间
  updateTime()
  timeInterval = window.setInterval(updateTime, 60000) // 每分钟更新一次

  // 启动状态栏模拟
  simulateStatusBar()
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

// 监听配置变化
watch(() => props.config, (newConfig) => {
  if (newConfig) {
    updateConfig(newConfig)
  }
}, { deep: true })
</script>

<style scoped lang="scss">
.bill-container {
  width: 100%;
  height: 100vh;
  height: 100dvh; // 使用动态视口高度，避免移动端地址栏遮挡
  background: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #000;
  user-select: none;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  background-color: #EFEFEF;
  flex-shrink: 0;
  transition: all 0.3s ease;

  .time {
    color: #000;
  }

  .status-icons {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  // iOS 风格
  &.status-ios {
    background-color: #EFEFEF;
    padding: 10px 20px;

    .time {
      color: #000;
      font-weight: 600;
    }
  }

  // Android 风格
  &.status-android {
    background-color: #000;
    padding: 8px 16px;

    .time {
      color: #fff;
      font-weight: 500;
    }
  }

  // MIUI 风格
  &.status-miui {
    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
    padding: 12px 18px;

    .time {
      color: #fff;
      font-weight: 600;
    }
  }

  // EMUI 风格
  &.status-emui {
    background: linear-gradient(135deg, #667eea, #764ba2);
    padding: 10px 16px;

    .time {
      color: #fff;
      font-weight: 500;
    }
  }

  // ColorOS 风格
  &.status-coloros {
    background: linear-gradient(135deg, #f093fb, #f5576c);
    padding: 11px 17px;

    .time {
      color: #fff;
      font-weight: 600;
    }
  }

  // FuntouchOS 风格
  &.status-funtouch {
    background: linear-gradient(135deg, #4facfe, #00f2fe);
    padding: 10px 18px;

    .time {
      color: #fff;
      font-weight: 500;
    }
  }

  // OxygenOS 风格
  &.status-oxygen {
    background-color: #1a1a1a;
    padding: 9px 15px;

    .time {
      color: #fff;
      font-weight: 400;
    }
  }

  // Pixel 风格
  &.status-pixel {
    background-color: #fff;
    padding: 10px 20px;
    border-bottom: 1px solid #e0e0e0;

    .time {
      color: #000;
      font-weight: 500;
    }
  }

  .signal-container {
    .signal-bars {
      display: flex;
      align-items: flex-end;
      gap: 1px;
      height: 12px;

      .signal-bar {
        width: 3px;
        background: #ccc;
        border-radius: 1px;
        transition: background-color 0.3s;

        &:nth-child(1) {
          height: 4px;
        }

        &:nth-child(2) {
          height: 6px;
        }

        &:nth-child(3) {
          height: 8px;
        }

        &:nth-child(4) {
          height: 10px;
        }

        &.active {
          background: #000;
        }
      }
    }
  }

  .wifi-container {
    .wifi-icon {
      width: 16px;
      height: 12px;
      fill: #ccc;
      transition: fill 0.3s;

      &.active {
        fill: #000;
      }
    }
  }

  .battery-container {
    display: flex;
    align-items: center;
    gap: 3px;

    .battery-outline {
      position: relative;
      width: 28px;
      height: 14px;
      border: 1px solid #000;
      border-radius: 5px;
      background: #fff;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;

      .battery-level {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        background: #000;
        border-radius: 0;
        transition: width 0.3s ease, background-color 0.3s ease;
        min-width: 2px;
        z-index: 1;
      }

      .battery-tip {
        position: absolute;
        right: -2px;
        top: 50%;
        transform: translateY(-50%);
        width: 1.5px;
        height: 4px;
        background: #000;
        border-radius: 0 1px 1px 0;
        z-index: 2;
      }

      .battery-highlight {
        position: absolute;
        top: 1px;
        left: 1px;
        right: 1px;
        height: 1px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 0.5px;
        pointer-events: none;
        z-index: 3;
      }

      .battery-text {
        font-size: 10px;
        color: #fff;
        font-weight: 600;
        z-index: 4;
        position: relative;
        text-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
        line-height: 1;
      }
    }
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #EFEFEF;
  flex-shrink: 0;

  .header-left,
  .header-right {
    width: 40px;
  }

  .close-btn,
  .menu-btn {
    color: #000;
    font-size: 18px;

    &:hover {
      opacity: 0.7;
    }
  }

  .header-title {
    font-size: 18px;
    font-weight: 600;
    color: #000;
  }
}

.filter-bar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: #EFEFEF;
  flex-shrink: 0;

  .filter-btn,
  .search-btn {
    flex: 1/2;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 15px 10px;
    background: #E3E3E3;
    border-radius: 20px;
    font-size: 14px;
    color: #000;
    font-weight: 400;
    cursor: pointer;

    &:hover {
      background: #f0f0f0;
    }
  }

  .filter-divider{
    width: 1px;
    height: 80%;
    background: #E3E3E3;
  }

  .qr-icon {
    font-size: 14px;
    color: #666;
  }

  .dropdown-icon {
    font-size: 14px;
    color: #666;
  }

  .search-icon {
    font-size: 14px;
    color: #666;
  }
}

.bill-list-container {
  flex: 1;
  overflow: hidden;
  position: relative;
  padding-right: 2px; // 为滚动条预留空间
  min-height: 0; // 确保flex子元素可以正确收缩
}

.bill-list {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px; // 确保内容不被滚动条遮挡
  padding-bottom: 20px; // 为底部内容添加额外空间

  // 确保最后一个元素有足够的底部间距
  .bill-item:last-child {
    margin-bottom: 20px;
  }

  // 隐藏滚动条
  &::-webkit-scrollbar {
    display: none;
  }

  // Firefox 隐藏滚动条
  scrollbar-width: none;
  -ms-overflow-style: none;

  .bill-item {
    &.month-header {
      border-bottom: 1px solid #f0f0f0;
    }

    &.transaction-item {
      border-bottom: 1px solid #fafafa;
    }
  }
}

.month-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  background-color: #EFEFEF;

  &:hover {
    background: #fafafa;
  }

  .month-info {
    display: flex;
    align-items: center;
    gap: 8px;

    .month-text {
      font-size: 16px;
      font-weight: 500;
      color: #000;
    }

    .dropdown-icon {
      font-size: 14px;
      color: #666;
      transition: transform 0.2s;

      &.expanded {
        transform: rotate(90deg);
      }
    }
  }

  .month-summary {
    display: flex;
    gap: 12px;
    font-size: 14px;
    color: #999;

    .expense,
    .income {
      white-space: nowrap;
    }
  }
}

.transaction-content {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 12px;

  .transaction-icon {
    .icon-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #ffd700;
      display: flex;
      align-items: center;
      justify-content: center;

      .icon-inner {
        color: #fff;
        font-size: 16px;
        font-weight: bold;
      }

      img{
        width: 100%;
        height: 100%;
      }
    }
  }

  .transaction-info {
    flex: 1;
    min-width: 0;

    .transaction-desc {
      font-size: 16px;
      color: #000;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 0px;

      .emoji {
        font-size: 14px;
      }
    }

    .transaction-time {
      font-size: 14px;
      color: #999;
    }
  }

  .transaction-amount {
    font-size: 16px;
    font-weight: 500;
    color: #000;
    white-space: nowrap;

    &.income {
      color: #F8C41D;
    }
  }
}

// 响应式设计
@media (max-width: 430px) {
  .bill-container {
    width: 100%;
    height: 100vh; // 确保在移动端使用标准视口高度
  }

  .filter-bar {
    padding: 14px 16px;
    gap: 10px;

    .filter-btn,
    .search-btn {
      font-size: 14px;
      padding: 8px 14px;
    }
  }

  .month-header-content {
    padding: 16px;

    .month-info .month-text {
      font-size: 17px;
    }

    .month-summary {
      font-size: 14px;
    }
  }

  .transaction-content {
    padding: 16px;

    .transaction-info .transaction-desc {
      font-size: 16px;
    }

    .transaction-amount {
      font-size: 16px;
    }
  }

  // 移动端滚动条优化
  .bill-list {
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      min-height: 30px;
    }

    padding-bottom: 30px; // 移动端增加更多底部空间
  }
}

// 6.7英寸屏幕专门优化
@media (min-width: 375px) and (max-width: 430px) {
  .bill-container {
    width: 100%;
  }

  .status-bar {
    padding: 12px 24px;
  }

  .header {
    padding: 16px 24px;

    .header-title {
      font-size: 20px;
    }
  }

  .filter-bar {
    padding: 16px 20px;

    .filter-btn,
    .search-btn {
      font-size: 15px;
      padding: 10px 16px;
    }
  }

  .month-header-content {
    padding: 18px 20px;

    .month-info .month-text {
      font-size: 18px;
    }

    .month-summary {
      font-size: 15px;
    }
  }

  .transaction-content {
    padding: 18px 20px;

    .transaction-info .transaction-desc {
      font-size: 17px;
    }

    .transaction-amount {
      font-size: 17px;
    }
  }
}
</style>
