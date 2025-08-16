<template>
  <div class="bill-config-visual">
    <el-form 
      :model="visualConfig" 
      label-position="top" 
      size="small"
      @submit.prevent="handleSubmit"
    >
      <!-- 基础配置 -->
      <el-form-item label="页面标题">
        <el-input 
          v-model="visualConfig.title" 
          placeholder="请输入页面标题"
          @input="updateConfig"
        />
      </el-form-item>

      <!-- 筛选选项 -->
      <el-form-item label="筛选选项">
        <div class="filter-options">
          <div 
            v-for="(_, index) in visualConfig.filterOptions || []" 
            :key="index"
            class="filter-option-item"
          >
            <el-input 
              v-model="visualConfig.filterOptions![index]" 
              placeholder="筛选选项"
              @input="updateConfig"
            />
            <el-button 
              @click="removeFilterOption(index)" 
              type="danger" 
              size="small"
              :icon="Delete"
              circle
            />
          </div>
          <el-button 
            @click="addFilterOption" 
            type="primary" 
            size="small"
            :icon="Plus"
            plain
          >
            添加筛选选项
          </el-button>
        </div>
      </el-form-item>

      <!-- 月度账单 -->
      <el-form-item label="月度账单">
        <div class="monthly-bills">
          <div 
            v-for="(monthlyBill, monthIndex) in visualConfig.monthlyBills" 
            :key="monthIndex"
            class="monthly-bill-item"
          >
            <el-card shadow="hover" class="monthly-bill-card">
              <template #header>
                <div class="monthly-bill-header">
                  <span>{{ formatMonthDisplay(monthlyBill) }}</span>
                  <el-button 
                    @click="removeMonthlyBill(monthIndex)" 
                    type="danger" 
                    size="small"
                    :icon="Delete"
                    text
                  />
                </div>
              </template>

              <!-- 月度基本信息 -->
              <el-row :gutter="12">
                <el-col :span="8">
                  <el-form-item label="年份">
                    <el-input-number 
                      v-model="monthlyBill.year" 
                      :min="2020" 
                      :max="2030"
                      @change="updateConfig"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="月份">
                    <el-select 
                      v-model="monthlyBill.month" 
                      @change="updateConfig"
                      style="width: 100%"
                    >
                      <el-option 
                        v-for="month in 12" 
                        :key="month" 
                        :label="`${month}月`" 
                        :value="month" 
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="总收入">
                    <el-input-number 
                      v-model="monthlyBill.totalIncome" 
                      :min="0" 
                      :precision="2"
                      @change="updateConfig"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="总支出">
                <el-input-number 
                  v-model="monthlyBill.totalExpense" 
                  :min="0" 
                  :precision="2"
                  @change="updateConfig"
                  style="width: 100%"
                />
              </el-form-item>

              <!-- 交易记录 -->
              <el-form-item label="交易记录">
                <div class="transactions">
                  <div 
                    v-for="(transaction, transIndex) in monthlyBill.transactions" 
                    :key="transIndex"
                    class="transaction-item"
                  >
                    <el-card shadow="never" class="transaction-card">
                      <template #header>
                        <div class="transaction-header">
                          <span>交易 {{ transIndex + 1 }}</span>
                          <el-button 
                            @click="removeTransaction(monthIndex, transIndex)" 
                            type="danger" 
                            size="small"
                            :icon="Delete"
                            text
                          />
                        </div>
                      </template>

                      <el-row :gutter="12">
                        <el-col :span="12">
                          <el-form-item label="交易类型">
                            <el-select 
                              v-model="transaction.type" 
                              @change="updateConfig"
                              style="width: 100%"
                            >
                              <el-option label="收入" value="income" />
                              <el-option label="支出" value="expense" />
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="金额">
                            <el-input-number 
                              v-model="transaction.amount" 
                              :min="0" 
                              :precision="2"
                              @change="updateConfig"
                              style="width: 100%"
                            />
                          </el-form-item>
                        </el-col>
                      </el-row>

                      <el-form-item label="描述">
                        <el-input 
                          v-model="transaction.description" 
                          placeholder="交易描述"
                          @input="updateConfig"
                        />
                      </el-form-item>

                      <el-row :gutter="12">
                        <el-col :span="12">
                          <el-form-item label="收款人">
                            <el-input 
                              v-model="transaction.recipient" 
                              placeholder="收款人（可选）"
                              @input="updateConfig"
                            />
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="表情符号">
                            <el-input 
                              v-model="transaction.emoji" 
                              placeholder="表情符号（可选）"
                              @input="updateConfig"
                            />
                          </el-form-item>
                        </el-col>
                      </el-row>

                      <el-row :gutter="12">
                        <el-col :span="12">
                          <el-form-item label="日期">
                            <el-input 
                              v-model="transaction.date" 
                              placeholder="如：7月4日"
                              @input="updateConfig"
                            />
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="时间">
                            <el-input 
                              v-model="transaction.time" 
                              placeholder="如：20:54"
                              @input="updateConfig"
                            />
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-card>
                  </div>

                  <el-button 
                    @click="addTransaction(monthIndex)" 
                    type="primary" 
                    size="small"
                    :icon="Plus"
                    plain
                  >
                    添加交易记录
                  </el-button>
                </div>
              </el-form-item>
            </el-card>
          </div>

          <el-button 
            @click="addMonthlyBill" 
            type="success" 
            size="small"
            :icon="Plus"
            plain
          >
            添加月度账单
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { BillConfig, MonthlyBill, Transaction } from '@/types/bill'
import { Plus, Delete } from '@element-plus/icons-vue'

// Props
interface Props {
  config: BillConfig
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  update: [config: BillConfig]
}>()

// 响应式数据
const visualConfig = ref<BillConfig>({
  title: '',
  filterOptions: [],
  monthlyBills: []
})

// 监听外部配置变化
watch(() => props.config, (newConfig) => {
  visualConfig.value = JSON.parse(JSON.stringify(newConfig))
}, { deep: true, immediate: true })

// 计算属性
const formatMonthDisplay = (monthlyBill: MonthlyBill) => {
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ]
  return `${monthlyBill.year}年${monthNames[monthlyBill.month - 1]}`
}

// 方法
const updateConfig = () => {
  emit('update', JSON.parse(JSON.stringify(visualConfig.value)))
}

const addFilterOption = () => {
  if (!visualConfig.value.filterOptions) {
    visualConfig.value.filterOptions = []
  }
  visualConfig.value.filterOptions.push('')
  updateConfig()
}

const removeFilterOption = (index: number) => {
  if (visualConfig.value.filterOptions) {
    visualConfig.value.filterOptions.splice(index, 1)
    updateConfig()
  }
}

const addMonthlyBill = () => {
  const newMonthlyBill: MonthlyBill = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    totalIncome: 0,
    totalExpense: 0,
    transactions: []
  }
  visualConfig.value.monthlyBills.push(newMonthlyBill)
  updateConfig()
}

const removeMonthlyBill = (index: number) => {
  visualConfig.value.monthlyBills.splice(index, 1)
  updateConfig()
}

const addTransaction = (monthIndex: number) => {
  const newTransaction: Transaction = {
    id: Date.now().toString(),
    type: 'expense',
    amount: 0,
    description: '',
    date: '',
    time: ''
  }
  visualConfig.value.monthlyBills[monthIndex].transactions.push(newTransaction)
  updateConfig()
}

const removeTransaction = (monthIndex: number, transIndex: number) => {
  visualConfig.value.monthlyBills[monthIndex].transactions.splice(transIndex, 1)
  updateConfig()
}

const handleSubmit = () => {
  updateConfig()
}
</script>

<style scoped lang="scss">
.bill-config-visual {
  .filter-options {
    .filter-option-item {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
      align-items: center;
    }
  }

  .monthly-bills {
    .monthly-bill-item {
      margin-bottom: 16px;
    }

    .monthly-bill-card {
      .monthly-bill-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
      }
    }
  }

  .transactions {
    .transaction-item {
      margin-bottom: 12px;
    }

    .transaction-card {
      .transaction-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 500;
      }
    }
  }

  // 美化滚动条
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f5f5f5;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
    
    &:hover {
      background: #a8a8a8;
    }
  }
  
  // Firefox 滚动条样式
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f5f5f5;
}
</style>
