// 交易类型
export type TransactionType = 'income' | 'expense'

// 交易记录
export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  description: string
  recipient?: string
  date: string
  time: string
  icon?: string
  emoji?: string
}

// 月度账单数据
export interface MonthlyBill {
  year: number
  month: number
  transactions: Transaction[]
  totalIncome: number
  totalExpense: number
}

// 账单配置
export interface BillConfig {
  title?: string
  filterOptions?: string[]
  monthlyBills: MonthlyBill[]
}

// 账单列表项
export interface BillListItem {
  type: 'header' | 'transaction'
  data: MonthlyBill | Transaction
  monthKey?: string
}
