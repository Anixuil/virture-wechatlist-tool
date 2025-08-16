<template>
  <div class="bill-page">
    <div class="bill-layout">
      <!-- 左侧配置区域 -->
      <el-card class="config-panel" shadow="hover">
        <template #header>
          <div class="config-header">
            <span class="header-title">账单配置</span>
            <div class="config-actions">
              <el-button size="small" @click="loadConfig" type="info" plain>
                <el-icon>
                  <Download />
                </el-icon>
                加载
              </el-button>
              <el-button size="small" @click="saveConfig" type="primary">
                <el-icon>
                  <Upload />
                </el-icon>
                保存
              </el-button>
            </div>
          </div>
        </template>

        <div class="config-content">
          <!-- 手机配置面板 -->
          <el-card class="phone-config-panel" shadow="hover" style="margin-bottom: 16px;">
            <template #header>
              <div class="phone-config-header">
                <span class="header-title">手机配置</span>
                <el-button size="small" @click="showAdvancedConfig = !showAdvancedConfig" type="text">
                  <el-icon>
                    <Setting />
                  </el-icon>
                  {{ showAdvancedConfig ? '收起' : '高级' }}
                </el-button>
              </div>
            </template>

            <div class="phone-config-content">
              <!-- 基础配置 -->
              <div class="basic-config">
                <el-row :gutter="12">
                  <el-col :span="8">
                    <el-form-item label="尺寸" size="small">
                      <el-select v-model="phoneSize" @change="updatePhoneSize" placeholder="尺寸" style="width: 100%">
                        <el-option label="小屏" value="small" />
                        <el-option label="中屏" value="medium" />
                        <el-option label="大屏" value="large" />
                        <el-option label="超大屏" value="xlarge" />
                        <el-option label="自定义" value="custom" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="品牌" size="small">
                      <el-select v-model="phoneBrand" @change="updatePhoneBrand" placeholder="品牌" style="width: 100%">
                        <el-option label="iPhone" value="iphone" />
                        <el-option label="Samsung" value="samsung" />
                        <el-option label="Huawei" value="huawei" />
                        <el-option label="Xiaomi" value="xiaomi" />
                        <el-option label="OPPO" value="oppo" />
                        <el-option label="vivo" value="vivo" />
                        <el-option label="OnePlus" value="oneplus" />
                        <el-option label="Google" value="google" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="通知栏" size="small">
                      <el-select v-model="statusBarStyle" @change="updateStatusBarStyle" placeholder="样式"
                        style="width: 100%">
                        <el-option label="iOS" value="ios" />
                        <el-option label="Android" value="android" />
                        <el-option label="MIUI" value="miui" />
                        <el-option label="EMUI" value="emui" />
                        <el-option label="ColorOS" value="coloros" />
                        <el-option label="Funtouch" value="funtouch" />
                        <el-option label="Oxygen" value="oxygen" />
                        <el-option label="Pixel" value="pixel" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <!-- 自定义尺寸配置 -->
                <el-row v-if="phoneSize === 'custom'" :gutter="12">
                  <el-col :span="12">
                    <el-form-item label="宽度" size="small">
                      <el-input-number v-model="customWidth" :min="200" :max="600" @change="updateCustomSize"
                        style="width: 100%" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="高度" size="small">
                      <el-input-number v-model="customHeight" :min="400" :max="1000" @change="updateCustomSize"
                        style="width: 100%" />
                    </el-form-item>
                  </el-col>
                </el-row>

                <!-- 快速预设 -->
                <div class="preset-section">
                  <div class="preset-buttons">
                    <el-button v-for="preset in phonePresets.slice(0, 6)" :key="preset.name" size="small"
                      @click="applyPreset(preset)" type="info" plain>
                      {{ preset.name }}
                    </el-button>
                  </div>
                </div>
              </div>

              <!-- 高级配置 - 可折叠 -->
              <el-collapse-transition>
                <div v-show="showAdvancedConfig" class="advanced-config">
                  <el-divider content-position="left">高级配置</el-divider>

                  <!-- 配置搜索 -->
                  <el-form-item label="配置搜索" size="small">
                    <el-input v-model="searchKeyword" placeholder="搜索配置..." @keyup.enter="searchConfig" clearable>
                      <template #append>
                        <el-button @click="searchConfig" type="primary">
                          <el-icon>
                            <Search />
                          </el-icon>
                        </el-button>
                      </template>
                    </el-input>
                  </el-form-item>

                  <!-- 配置模板 -->
                  <el-form-item label="配置模板" size="small">
                    <div class="preset-buttons">
                      <el-button v-for="template in configTemplates" :key="template.name" size="small"
                        @click="applyConfigTemplate(template)" type="success" plain>
                        {{ template.name }}
                      </el-button>
                    </div>
                  </el-form-item>

                  <!-- 当前配置信息 -->
                  <el-form-item label="当前配置" size="small">
                    <el-descriptions :column="1" size="small" border>
                      <el-descriptions-item label="尺寸">{{ customWidth }}x{{ customHeight }}</el-descriptions-item>
                      <el-descriptions-item label="品牌">{{ getBrandName(phoneBrand) }}</el-descriptions-item>
                      <el-descriptions-item label="通知栏">{{ getStatusBarName(statusBarStyle) }}</el-descriptions-item>
                    </el-descriptions>
                  </el-form-item>

                  <!-- 历史记录 -->
                  <el-form-item v-if="configHistory.length > 0" label="历史记录" size="small">
                    <el-tag type="info" class="history-count">{{ configHistory.length }}/10</el-tag>
                    <div class="history-scrollbar">
                      <div class="history-list">
                        <div v-for="(config, index) in configHistory.slice(0, 5)" :key="index" class="history-item"
                          @click="loadFromHistory(index)">
                          <div class="history-info">
                            <span class="history-title">{{ getBrandName(config.brand) }} - {{ getSizeName(config.size)
                              }}</span>
                            <span class="history-time">{{ config.timestamp }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-form-item>

                  <!-- 配置操作 -->
                  <el-form-item label="配置操作" size="small">
                    <div class="config-actions-grid">
                      <el-button size="small" @click="savePhoneConfig" type="primary" plain>
                        <el-icon>
                          <Download />
                        </el-icon>
                        保存
                      </el-button>
                      <el-button size="small" @click="loadPhoneConfig" type="info" plain>
                        <el-icon>
                          <Upload />
                        </el-icon>
                        加载
                      </el-button>
                      <el-button size="small" @click="copyPhoneConfig" type="warning" plain>
                        <el-icon>
                          <CopyDocument />
                        </el-icon>
                        复制
                      </el-button>
                      <el-button size="small" @click="pastePhoneConfig" type="warning" plain>
                        <el-icon>
                          <DocumentCopy />
                        </el-icon>
                        粘贴
                      </el-button>
                      <el-button size="small" @click="sharePhoneConfig" type="success" plain>
                        <el-icon>
                          <Share />
                        </el-icon>
                        分享
                      </el-button>
                      <el-button size="small" @click="exportPhoneConfigAsImage" type="primary" plain>
                        <el-icon>
                          <Picture />
                        </el-icon>
                        导出
                      </el-button>
                      <el-button size="small" @click="saveToHistory" type="success" plain>
                        <el-icon>
                          <Star />
                        </el-icon>
                        保存历史
                      </el-button>
                      <el-button size="small" @click="clearHistory" type="danger" plain>
                        <el-icon>
                          <Delete />
                        </el-icon>
                        清空历史
                      </el-button>
                      <el-button size="small" @click="randomPhoneConfig" type="info" plain>
                        <el-icon>
                          <Refresh />
                        </el-icon>
                        随机
                      </el-button>
                      <el-button size="small" @click="resetPhoneConfig" type="danger" plain>
                        <el-icon>
                          <RefreshRight />
                        </el-icon>
                        重置
                      </el-button>
                    </div>
                  </el-form-item>
                </div>
              </el-collapse-transition>
            </div>
          </el-card>

          <!-- 模式切换 -->
          <div class="config-mode-switch">
            <el-radio-group v-model="configMode" @change="handleModeChange">
              <el-radio-button label="visual">
                <el-icon>
                  <Edit />
                </el-icon>
                可视化配置
              </el-radio-button>
              <el-radio-button label="json">
                <el-icon>
                  <Document />
                </el-icon>
                JSON配置
              </el-radio-button>
            </el-radio-group>
          </div>

          <!-- 可视化配置模式 -->
          <div v-if="configMode === 'visual'" class="visual-config">
            <BillConfigVisual :config="currentConfig" @update="handleVisualUpdate" />
          </div>

          <!-- JSON配置模式 -->
          <div v-else class="json-config">
            <el-form label-position="top" size="small">
              <el-form-item label="JSON配置">
                <el-input v-model="jsonConfig" type="textarea" :rows="15" placeholder="请输入JSON配置..."
                  @input="validateAndApply" :class="{ 'is-error': jsonError }" />
                <el-alert v-if="jsonError" :title="`JSON格式错误: ${jsonError}`" type="error" :closable="false" show-icon
                  class="error-alert" />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-card>

      <!-- 中间账单展示区域 -->
      <div class="bill-preview">
        <!-- 手机预览 - 核心内容 -->
        <div class="phone-preview-container">
          <div class="phone-frame" :class="phoneFrameClasses" :style="phoneFrameStyles">
            <div class="phone-screen">
              <BillList :config="currentConfig" :status-bar-style="statusBarStyle" @close="handleClose" />
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧配置说明 -->
      <el-card class="help-panel" shadow="hover">
        <template #header>
          <div class="help-header">
            <span class="header-title">配置说明</span>
          </div>
        </template>

        <div class="help-content">
          <el-collapse v-model="activeHelpNames" accordion>
            <el-collapse-item title="配置模式" name="mode">
              <ul class="help-list">
                <li><strong>可视化配置:</strong> 通过表单界面直观编辑配置</li>
                <li><strong>JSON配置:</strong> 直接编辑JSON格式的配置文件</li>
                <li><strong>模式切换:</strong> 两种模式可以随时切换，数据自动同步</li>
              </ul>
            </el-collapse-item>

            <el-collapse-item title="基本配置" name="basic">
              <ul class="help-list">
                <li><strong>title:</strong> 账单页面标题</li>
                <li><strong>filterOptions:</strong> 筛选选项数组</li>
                <li><strong>monthlyBills:</strong> 月度账单数组</li>
              </ul>
            </el-collapse-item>

            <el-collapse-item title="月度账单字段" name="monthly">
              <ul class="help-list">
                <li><strong>year/month:</strong> 年月</li>
                <li><strong>totalIncome/totalExpense:</strong> 月收入/支出总额</li>
                <li><strong>transactions:</strong> 交易记录数组</li>
              </ul>
            </el-collapse-item>

            <el-collapse-item title="交易记录字段" name="transaction">
              <ul class="help-list">
                <li><strong>id:</strong> 唯一标识</li>
                <li><strong>type:</strong> 类型 (income/expense)</li>
                <li><strong>amount:</strong> 金额</li>
                <li><strong>description:</strong> 描述</li>
                <li><strong>recipient:</strong> 收款人 (可选)</li>
                <li><strong>date/time:</strong> 日期和时间</li>
                <li><strong>emoji:</strong> 表情符号 (可选)</li>
              </ul>
            </el-collapse-item>

            <el-collapse-item title="手机配置" name="phone">
              <ul class="help-list">
                <li><strong>手机尺寸:</strong> 选择不同屏幕尺寸或自定义</li>
                <li><strong>手机品牌:</strong> 选择不同品牌的外观样式</li>
                <li><strong>通知栏样式:</strong> 选择不同系统的通知栏风格</li>
                <li><strong>快速预设:</strong> 一键应用热门手机配置</li>
                <li><strong>配置模板:</strong> 专业配置模板，精确还原真实手机</li>
                <li><strong>历史记录:</strong> 自动保存最近10条配置记录</li>
              </ul>
            </el-collapse-item>
          </el-collapse>

          <div class="quick-actions">
            <el-button @click="addSampleData" type="primary" plain style="width: 100%; margin-bottom: 8px;">
              <el-icon>
                <Plus />
              </el-icon>
              添加示例数据
            </el-button>
            <el-button @click="clearData" type="danger" plain style="width: 100%; margin-bottom: 8px;">
              <el-icon>
                <Delete />
              </el-icon>
              清空数据
            </el-button>
            <el-button @click="switchToVisual" type="success" plain style="width: 100%; margin-bottom: 8px;">
              <el-icon>
                <Edit />
              </el-icon>
              切换到可视化
            </el-button>
            <el-button @click="switchToJson" type="warning" plain style="width: 100%;">
              <el-icon>
                <Document />
              </el-icon>
              切换到JSON
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import BillList from '@/components/BillList.vue'
import BillConfigVisual from '@/components/BillConfigVisual.vue'
import type { BillConfig } from '@/types/bill'
import {
  Download, Upload, Search, CopyDocument, DocumentCopy, Share, Picture,
  Star, Delete, Refresh,
  RefreshRight, Plus, Setting, Edit, Document
} from '@element-plus/icons-vue'

const router = useRouter()

const jsonConfig = ref('')
const jsonError = ref('')
const configMode = ref('visual') // 默认使用可视化模式
const currentConfig = ref<BillConfig>({
  title: '账单',
  filterOptions: ['二维码收付款', '查找交易'],
  monthlyBills: []
})

// 帮助面板展开状态
const activeHelpNames = ref(['mode'])

// 高级配置显示状态
const showAdvancedConfig = ref(false)

// 手机配置相关
const phoneSize = ref('medium')
const customWidth = ref(375)
const customHeight = ref(667)
const phoneBrand = ref('iphone')
const statusBarStyle = ref('ios')

// 手机尺寸预设
const phoneSizes = {
  small: { width: 320, height: 568 },
  medium: { width: 375, height: 667 },
  large: { width: 414, height: 896 },
  xlarge: { width: 428, height: 926 }
}

// 手机品牌预设
const phonePresets = [
  { name: 'iPhone 14', size: 'medium', brand: 'iphone', statusBar: 'ios' },
  { name: 'iPhone 14 Plus', size: 'large', brand: 'iphone', statusBar: 'ios' },
  { name: 'iPhone 14 Pro', size: 'medium', brand: 'iphone', statusBar: 'ios' },
  { name: 'Samsung S23', size: 'medium', brand: 'samsung', statusBar: 'android' },
  { name: 'Samsung S23 Ultra', size: 'large', brand: 'samsung', statusBar: 'android' },
  { name: 'Xiaomi 13', size: 'medium', brand: 'xiaomi', statusBar: 'miui' },
  { name: 'Huawei P60', size: 'medium', brand: 'huawei', statusBar: 'emui' },
  { name: 'OPPO Find X6', size: 'medium', brand: 'oppo', statusBar: 'coloros' },
  { name: 'vivo X90', size: 'medium', brand: 'vivo', statusBar: 'funtouch' },
  { name: 'OnePlus 11', size: 'medium', brand: 'oneplus', statusBar: 'oxygen' },
  { name: 'Google Pixel 7', size: 'medium', brand: 'google', statusBar: 'pixel' }
]

// 方法
const loadConfig = async () => {
  try {
    const response = await fetch('/bill-config.json')
    const config = await response.json()
    jsonConfig.value = JSON.stringify(config, null, 2)
    currentConfig.value = config
    jsonError.value = ''
  } catch (error) {
    console.error('加载配置失败:', error)
    jsonError.value = '加载配置失败'
  }
}

const saveConfig = () => {
  if (jsonError.value) {
    alert('请先修复JSON格式错误')
    return
  }

  try {
    const config = JSON.parse(jsonConfig.value)
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bill-config.json'
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    alert('保存失败')
  }
}

const validateAndApply = () => {
  try {
    const config = JSON.parse(jsonConfig.value)
    currentConfig.value = config
    jsonError.value = ''
  } catch (error) {
    jsonError.value = error instanceof Error ? error.message : '未知错误'
  }
}

// 处理模式切换
const handleModeChange = (mode: string) => {
  if (mode === 'json') {
    // 切换到JSON模式时，将当前配置转换为JSON
    jsonConfig.value = JSON.stringify(currentConfig.value, null, 2)
  }
}

// 处理可视化配置更新
const handleVisualUpdate = (config: BillConfig) => {
  currentConfig.value = config
  // 同步更新JSON配置
  jsonConfig.value = JSON.stringify(config, null, 2)
  jsonError.value = ''
}

// 切换到可视化模式
const switchToVisual = () => {
  configMode.value = 'visual'
}

// 切换到JSON模式
const switchToJson = () => {
  configMode.value = 'json'
  jsonConfig.value = JSON.stringify(currentConfig.value, null, 2)
}

const addSampleData = () => {
  const sampleConfig: BillConfig = {
    title: '账单',
    filterOptions: ['二维码收付款', '查找交易'],
    monthlyBills: [
      {
        year: 2025,
        month: 7,
        totalIncome: 244.00,
        totalExpense: 0.00,
        transactions: [
          {
            id: '1',
            type: 'income',
            amount: 244.00,
            description: '二维码收款-来自*',
            date: '7月4日',
            time: '20:54',
            emoji: '🌻'
          }
        ]
      },
      {
        year: 2025,
        month: 6,
        totalIncome: 0.00,
        totalExpense: 42.00,
        transactions: [
          {
            id: '2',
            type: 'expense',
            amount: 11.00,
            description: '扫二维码付款-给OMG.YYD',
            recipient: 'OMG.YYD',
            date: '6月30日',
            time: '08:05'
          },
          {
            id: '3',
            type: 'expense',
            amount: 22.00,
            description: '扫二维码付款-给栀子花',
            recipient: '栀子花',
            date: '6月26日',
            time: '11:44'
          }
        ]
      }
    ]
  }

  jsonConfig.value = JSON.stringify(sampleConfig, null, 2)
  currentConfig.value = sampleConfig
  jsonError.value = ''
}

const clearData = () => {
  const emptyConfig: BillConfig = {
    title: '账单',
    filterOptions: ['二维码收付款', '查找交易'],
    monthlyBills: []
  }

  jsonConfig.value = JSON.stringify(emptyConfig, null, 2)
  currentConfig.value = emptyConfig
  jsonError.value = ''
}

const handleClose = () => {
  router.push('/')
}

// 手机配置方法
const updatePhoneSize = () => {
  if (phoneSize.value !== 'custom') {
    const size = phoneSizes[phoneSize.value as keyof typeof phoneSizes]
    customWidth.value = size.width
    customHeight.value = size.height
  }
}

const updateCustomSize = () => {
  // 自定义尺寸更新逻辑
}

const updatePhoneBrand = () => {
  // 手机品牌更新逻辑
}

const updateStatusBarStyle = () => {
  // 通知栏样式更新逻辑
}

const applyPreset = (preset: any) => {
  phoneSize.value = preset.size
  phoneBrand.value = preset.brand
  statusBarStyle.value = preset.statusBar
  updatePhoneSize()
}

// 保存手机配置
const savePhoneConfig = () => {
  const phoneConfig = {
    size: phoneSize.value,
    width: customWidth.value,
    height: customHeight.value,
    brand: phoneBrand.value,
    statusBar: statusBarStyle.value
  }

  const blob = new Blob([JSON.stringify(phoneConfig, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'phone-config.json'
  a.click()
  URL.revokeObjectURL(url)
}

// 加载手机配置
const loadPhoneConfig = async () => {
  try {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const text = await file.text()
        const config = JSON.parse(text)
        phoneSize.value = config.size
        customWidth.value = config.width
        customHeight.value = config.height
        phoneBrand.value = config.brand
        statusBarStyle.value = config.statusBar
      }
    }
    input.click()
  } catch (error) {
    console.error('加载手机配置失败:', error)
  }
}

// 获取品牌名称
const getBrandName = (brand: string) => {
  const brandNames: Record<string, string> = {
    iphone: 'iPhone',
    samsung: 'Samsung',
    huawei: 'Huawei',
    xiaomi: 'Xiaomi',
    oppo: 'OPPO',
    vivo: 'vivo',
    oneplus: 'OnePlus',
    google: 'Google Pixel'
  }
  return brandNames[brand] || brand
}

// 获取通知栏样式名称
const getStatusBarName = (style: string) => {
  const styleNames: Record<string, string> = {
    ios: 'iOS',
    android: 'Android',
    miui: 'MIUI',
    emui: 'EMUI',
    coloros: 'ColorOS',
    funtouch: 'FuntouchOS',
    oxygen: 'OxygenOS',
    pixel: 'Pixel'
  }
  return styleNames[style] || style
}

// 随机生成手机配置
const randomPhoneConfig = () => {
  const sizes = Object.keys(phoneSizes)
  const brands = ['iphone', 'samsung', 'huawei', 'xiaomi', 'oppo', 'vivo', 'oneplus', 'google']
  const statusBars = ['ios', 'android', 'miui', 'emui', 'coloros', 'funtouch', 'oxygen', 'pixel']

  phoneSize.value = sizes[Math.floor(Math.random() * sizes.length)]
  phoneBrand.value = brands[Math.floor(Math.random() * brands.length)]
  statusBarStyle.value = statusBars[Math.floor(Math.random() * statusBars.length)]

  updatePhoneSize()
}

// 重置为默认配置
const resetPhoneConfig = () => {
  phoneSize.value = 'medium'
  phoneBrand.value = 'iphone'
  statusBarStyle.value = 'ios'
  customWidth.value = 375
  customHeight.value = 667
}

// 复制配置到剪贴板
const copyPhoneConfig = async () => {
  const phoneConfig = {
    size: phoneSize.value,
    width: customWidth.value,
    height: customHeight.value,
    brand: phoneBrand.value,
    statusBar: statusBarStyle.value
  }

  try {
    await navigator.clipboard.writeText(JSON.stringify(phoneConfig, null, 2))
    alert('配置已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    alert('复制失败，请手动复制')
  }
}

// 从剪贴板粘贴配置
const pastePhoneConfig = async () => {
  try {
    const text = await navigator.clipboard.readText()
    const config = JSON.parse(text)

    if (config.size && config.brand && config.statusBar) {
      phoneSize.value = config.size
      customWidth.value = config.width || 375
      customHeight.value = config.height || 667
      phoneBrand.value = config.brand
      statusBarStyle.value = config.statusBar
      alert('配置已从剪贴板粘贴')
    } else {
      alert('剪贴板内容不是有效的手机配置')
    }
  } catch (error) {
    console.error('粘贴失败:', error)
    alert('粘贴失败，请检查剪贴板内容')
  }
}

// 分享配置链接
const sharePhoneConfig = () => {
  const phoneConfig = {
    size: phoneSize.value,
    width: customWidth.value,
    height: customHeight.value,
    brand: phoneBrand.value,
    statusBar: statusBarStyle.value
  }

  const configString = encodeURIComponent(JSON.stringify(phoneConfig))
  const shareUrl = `${window.location.origin}${window.location.pathname}?config=${configString}`

  try {
    navigator.clipboard.writeText(shareUrl)
    alert('分享链接已复制到剪贴板')
  } catch (error) {
    console.error('复制分享链接失败:', error)
    alert('复制失败，请手动复制链接')
  }
}

// 导出手机配置为图片
const exportPhoneConfigAsImage = () => {
  const phoneFrame = document.querySelector('.phone-frame') as HTMLElement
  if (!phoneFrame) {
    alert('找不到手机框架元素')
    return
  }

  // 使用html2canvas库导出图片
  // 这里需要先安装html2canvas库
  // import html2canvas from 'html2canvas'

  alert('导出图片功能需要安装html2canvas库，请手动实现')
}



// 获取尺寸名称
const getSizeName = (size: string) => {
  const sizeNames: Record<string, string> = {
    small: '小屏',
    medium: '中屏',
    large: '大屏',
    xlarge: '超大屏',
    custom: '自定义'
  }
  return sizeNames[size] || size
}

// 配置历史记录
const configHistory = ref<any[]>([])

// 保存到历史记录
const saveToHistory = () => {
  const currentConfig = {
    size: phoneSize.value,
    width: customWidth.value,
    height: customHeight.value,
    brand: phoneBrand.value,
    statusBar: statusBarStyle.value,
    timestamp: new Date().toLocaleString()
  }

  configHistory.value.unshift(currentConfig)

  // 只保留最近10条记录
  if (configHistory.value.length > 10) {
    configHistory.value = configHistory.value.slice(0, 10)
  }

  // 保存到本地存储
  localStorage.setItem('phoneConfigHistory', JSON.stringify(configHistory.value))
}

// 从历史记录加载
const loadFromHistory = (index: number) => {
  const config = configHistory.value[index]
  if (config) {
    phoneSize.value = config.size
    customWidth.value = config.width
    customHeight.value = config.height
    phoneBrand.value = config.brand
    statusBarStyle.value = config.statusBar
  }
}

// 加载历史记录
const loadHistoryFromStorage = () => {
  try {
    const history = localStorage.getItem('phoneConfigHistory')
    if (history) {
      configHistory.value = JSON.parse(history)
    }
  } catch (error) {
    console.error('加载历史记录失败:', error)
  }
}

// 清空历史记录
const clearHistory = () => {
  if (confirm('确定要清空所有历史记录吗？')) {
    configHistory.value = []
    localStorage.removeItem('phoneConfigHistory')
    alert('历史记录已清空')
  }
}







// 配置模板
const configTemplates = [
  {
    name: 'iPhone 14 Pro',
    config: {
      size: 'medium',
      width: 393,
      height: 852,
      brand: 'iphone',
      statusBar: 'ios'
    }
  },
  {
    name: 'Samsung S23 Ultra',
    config: {
      size: 'large',
      width: 414,
      height: 896,
      brand: 'samsung',
      statusBar: 'android'
    }
  },
  {
    name: 'Xiaomi 13 Ultra',
    config: {
      size: 'large',
      width: 414,
      height: 896,
      brand: 'xiaomi',
      statusBar: 'miui'
    }
  },
  {
    name: 'Huawei P60 Pro',
    config: {
      size: 'medium',
      width: 393,
      height: 852,
      brand: 'huawei',
      statusBar: 'emui'
    }
  },
  {
    name: 'OPPO Find X6 Pro',
    config: {
      size: 'large',
      width: 414,
      height: 896,
      brand: 'oppo',
      statusBar: 'coloros'
    }
  }
]

// 应用配置模板
const applyConfigTemplate = (template: any) => {
  phoneSize.value = template.config.size
  customWidth.value = template.config.width
  customHeight.value = template.config.height
  phoneBrand.value = template.config.brand
  statusBarStyle.value = template.config.statusBar
}

// 配置搜索
const searchKeyword = ref('')

// 搜索配置
const searchConfig = () => {
  if (!searchKeyword.value.trim()) {
    return
  }

  const keyword = searchKeyword.value.toLowerCase()
  const results: Array<{
    type: 'preset' | 'template' | 'history'
    data: any
    index?: number
  }> = []

  // 搜索预设配置
  phonePresets.forEach(preset => {
    if (preset.name.toLowerCase().includes(keyword) ||
      getBrandName(preset.brand).toLowerCase().includes(keyword)) {
      results.push({ type: 'preset', data: preset })
    }
  })

  // 搜索配置模板
  configTemplates.forEach(template => {
    if (template.name.toLowerCase().includes(keyword) ||
      getBrandName(template.config.brand).toLowerCase().includes(keyword)) {
      results.push({ type: 'template', data: template })
    }
  })

  // 搜索历史记录
  configHistory.value.forEach((config, index) => {
    if (getBrandName(config.brand).toLowerCase().includes(keyword) ||
      getSizeName(config.size).toLowerCase().includes(keyword)) {
      results.push({ type: 'history', data: config, index })
    }
  })

  if (results.length > 0) {
    const resultText = results.map(result => {
      if (result.type === 'preset') {
        return `${result.data.name} (预设)`
      } else if (result.type === 'template') {
        return `${result.data.name} (模板)`
      } else {
        return `${getBrandName(result.data.brand)} - ${getSizeName(result.data.size)} (历史)`
      }
    }).join('\n')

    alert(`搜索结果:\n\n${resultText}`)
  } else {
    alert('未找到匹配的配置')
  }
}

// 计算属性
const phoneFrameClasses = computed(() => {
  return {
    [`phone-${phoneBrand.value}`]: true,
    [`status-${statusBarStyle.value}`]: true
  }
})

const phoneFrameStyles = computed(() => {
  return {
    width: `${customWidth.value}px`,
    height: `${customHeight.value}px`
  }
})

// 生命周期
onMounted(() => {
  loadConfig()
  loadPhoneConfigFromUrl()
  loadHistoryFromStorage()
})

// 从URL参数加载手机配置
const loadPhoneConfigFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const configParam = urlParams.get('config')

  if (configParam) {
    try {
      const config = JSON.parse(decodeURIComponent(configParam))
      if (config.size && config.brand && config.statusBar) {
        phoneSize.value = config.size
        customWidth.value = config.width || 375
        customHeight.value = config.height || 667
        phoneBrand.value = config.brand
        statusBarStyle.value = config.statusBar
      }
    } catch (error) {
      console.error('从URL加载手机配置失败:', error)
    }
  }
}
</script>

<style scoped lang="scss">
.bill-page {
  height: 100vh;
  background: #f5f5f5;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.bill-layout {
  display: grid;
  grid-template-columns: 350px 1fr 300px;
  gap: 20px;
  width: 100%;
  height: 100%;
}

// 左侧配置面板
.config-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }

  .config-actions {
    display: flex;
    gap: 8px;
  }
}

.config-content {
  flex: 1;
  overflow-y: auto;

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

.config-mode-switch {
  margin-bottom: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;

  .el-radio-group {
    width: 100%;

    .el-radio-button {
      flex: 1;

      .el-radio-button__inner {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        width: 100%;
        padding: 8px 12px;
        font-size: 13px;
      }
    }
  }
}

.visual-config {
  .bill-config-visual {
    max-height: calc(100vh - 300px);
    overflow-y: auto;
  }
}

.json-config {
  .el-form-item {
    margin-bottom: 16px;
  }
}

.error-alert {
  margin-top: 8px;
}

// 中间账单预览区域
.bill-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  overflow: hidden;
}

// 手机配置面板
.phone-config-panel {
  width: 100%;
  flex-shrink: 0;
}

.phone-config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }
}

.phone-config-content {
  .basic-config {
    .preset-section {
      margin-top: 12px;
    }
  }

  .advanced-config {
    margin-top: 16px;
  }
}

.preset-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.config-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
  gap: 6px;
}

.history-count {
  margin-bottom: 8px;
}

.history-scrollbar {
  max-height: 120px;
  overflow-y: auto;
  border: 1px solid #e4e7ed;
  border-radius: 4px;

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

.history-list {
  .history-item {
    padding: 8px 12px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f5f7fa;
    }

    &:last-child {
      border-bottom: none;
    }

    .history-info {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .history-title {
        font-size: 12px;
        color: #333;
        font-weight: 500;
      }

      .history-time {
        font-size: 10px;
        color: #999;
      }
    }
  }
}

.phone-preview-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.phone-frame {
  background: #000;
  border-radius: 30px;
  padding: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: #333;
    border-radius: 2px;
  }

  // iPhone 样式
  &.phone-iphone {
    border-radius: 30px;
    padding: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);

    &::before {
      width: 60px;
      height: 4px;
      background: #333;
    }
  }

  // Samsung 样式
  &.phone-samsung {
    border-radius: 25px;
    padding: 6px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05);

    &::before {
      width: 50px;
      height: 3px;
      background: #222;
    }
  }

  // Huawei 样式
  &.phone-huawei {
    border-radius: 28px;
    padding: 7px;
    box-shadow: 0 9px 28px rgba(102, 126, 234, 0.2), 0 0 0 1px rgba(102, 126, 234, 0.1);

    &::before {
      width: 55px;
      height: 3.5px;
      background: #2a2a2a;
    }
  }

  // Xiaomi 样式
  &.phone-xiaomi {
    border-radius: 26px;
    padding: 6px;
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.2), 0 0 0 1px rgba(255, 107, 107, 0.1);

    &::before {
      width: 52px;
      height: 3px;
      background: #1a1a1a;
    }
  }

  // OPPO 样式
  &.phone-oppo {
    border-radius: 27px;
    padding: 7px;
    box-shadow: 0 8px 26px rgba(240, 147, 251, 0.2), 0 0 0 1px rgba(240, 147, 251, 0.1);

    &::before {
      width: 54px;
      height: 3.5px;
      background: #2c2c2c;
    }
  }

  // vivo 样式
  &.phone-vivo {
    border-radius: 29px;
    padding: 8px;
    box-shadow: 0 9px 27px rgba(79, 172, 254, 0.2), 0 0 0 1px rgba(79, 172, 254, 0.1);

    &::before {
      width: 58px;
      height: 4px;
      background: #2e2e2e;
    }
  }

  // OnePlus 样式
  &.phone-oneplus {
    border-radius: 24px;
    padding: 5px;
    box-shadow: 0 7px 24px rgba(26, 26, 26, 0.3), 0 0 0 1px rgba(26, 26, 26, 0.1);

    &::before {
      width: 48px;
      height: 2.5px;
      background: #1f1f1f;
    }
  }

  // Google Pixel 样式
  &.phone-google {
    border-radius: 32px;
    padding: 10px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05);

    &::before {
      width: 65px;
      height: 4.5px;
      background: #333;
    }
  }

  // 响应式手机尺寸调整
  @media (max-width: 480px) {
    border-radius: 20px;
    padding: 6px;

    &::before {
      width: 40px;
      height: 3px;
    }
  }
}

.phone-screen {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 22px;
  overflow: hidden;
  position: relative;
}

// 右侧帮助面板
.help-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.help-header {
  .header-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
}

.help-content {
  flex: 1;
  overflow-y: auto;

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

.help-list {
  margin: 0;
  padding-left: 16px;
  font-size: 13px;
  line-height: 1.6;

  li {
    margin-bottom: 6px;

    strong {
      color: #409eff;
      font-weight: 600;
    }
  }
}

.quick-actions {
  margin-top: 16px;
}



// 响应式设计
@media (min-width: 1600px) {
  .bill-layout {
    grid-template-columns: 400px 1fr 350px;
    gap: 30px;
  }

  .phone-frame {
    width: 400px;
    height: 711px;
  }
}

@media (min-width: 1920px) {
  .bill-layout {
    grid-template-columns: 450px 1fr 400px;
    gap: 40px;
  }

  .phone-frame {
    width: 450px;
    height: 800px;
  }

  .bill-page {
    padding: 30px;
  }
}

@media (max-width: 1400px) {
  .bill-layout {
    grid-template-columns: 300px 1fr 280px;
    gap: 15px;
  }
}

@media (max-width: 1200px) {
  .bill-layout {
    grid-template-columns: 280px 1fr 250px;
    gap: 15px;
  }

  .phone-frame {
    width: 320px;
    height: 568px;
  }
}

@media (max-width: 1000px) {
  .bill-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    height: auto;
    min-height: calc(100vh - 40px);
  }

  .config-panel {
    order: 1;
  }

  .bill-preview {
    order: 2;
    padding: 20px 0;
    height: auto;
  }

  .help-panel {
    order: 3;
  }

  .phone-config-panel {
    max-width: 100%;
  }

  .phone-preview-container {
    min-height: 400px;
  }

  .preset-buttons {
    justify-content: center;
  }

  .config-actions-grid {
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
  }
}

@media (max-width: 768px) {
  .bill-page {
    padding: 10px;
  }

  .bill-layout {
    gap: 10px;
  }

  .phone-frame {
    width: 320px;
    height: 568px;
  }
}

@media (max-width: 480px) {
  .bill-page {
    padding: 5px;
  }

  .bill-layout {
    gap: 5px;
  }

  .phone-config-panel {
    max-width: 100%;
  }

  .phone-config-content {
    padding: 12px;
    gap: 10px;
  }

  .config-actions-grid {
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    gap: 6px;
  }

  .preset-buttons {
    justify-content: center;
  }
}
</style>
