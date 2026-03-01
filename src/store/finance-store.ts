import { create } from 'zustand'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  color: string
}

export interface Couple {
  id: string
  name: string
  members: User[]
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  type: 'income' | 'expense'
}

export interface Transaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  date: string
  category: Category
  user: User
  isRecurring: boolean
  notes?: string
}

export interface Goal {
  id: string
  name: string
  description?: string
  targetAmount: number
  currentAmount: number
  targetDate?: string
  icon: string
  color: string
  status: 'active' | 'completed' | 'cancelled'
}

export interface Budget {
  id: string
  amount: number
  month: number
  year: number
  category: Category
}

interface FinanceState {
  // Data
  couple: Couple | null
  currentUser: User | null
  transactions: Transaction[]
  categories: Category[]
  goals: Goal[]
  budgets: Budget[]
  
  // UI State
  isLoading: boolean
  activeTab: string
  selectedMonth: Date
  
  // Actions
  setCouple: (couple: Couple | null) => void
  setCurrentUser: (user: User | null) => void
  setTransactions: (transactions: Transaction[]) => void
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  setCategories: (categories: Category[]) => void
  addCategory: (category: Category) => void
  setGoals: (goals: Goal[]) => void
  addGoal: (goal: Goal) => void
  updateGoal: (id: string, goal: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  setBudgets: (budgets: Budget[]) => void
  setActiveTab: (tab: string) => void
  setSelectedMonth: (date: Date) => void
  setIsLoading: (loading: boolean) => void
  
  // Computed
  getTotalIncome: () => number
  getTotalExpenses: () => number
  getBalance: () => number
  getTransactionsByCategory: () => Record<string, number>
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  // Initial State
  couple: null,
  currentUser: null,
  transactions: [],
  categories: [],
  goals: [],
  budgets: [],
  isLoading: true,
  activeTab: 'dashboard',
  selectedMonth: new Date(),
  
  // Actions
  setCouple: (couple) => set({ couple }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setTransactions: (transactions) => set({ transactions }),
  
  addTransaction: (transaction) => set((state) => ({
    transactions: [transaction, ...state.transactions]
  })),
  
  updateTransaction: (id, updates) => set((state) => ({
    transactions: state.transactions.map(t => 
      t.id === id ? { ...t, ...updates } : t
    )
  })),
  
  deleteTransaction: (id) => set((state) => ({
    transactions: state.transactions.filter(t => t.id !== id)
  })),
  
  setCategories: (categories) => set({ categories }),
  addCategory: (category) => set((state) => ({
    categories: [...state.categories, category]
  })),
  
  setGoals: (goals) => set({ goals }),
  addGoal: (goal) => set((state) => ({
    goals: [...state.goals, goal]
  })),
  
  updateGoal: (id, updates) => set((state) => ({
    goals: state.goals.map(g => 
      g.id === id ? { ...g, ...updates } : g
    )
  })),
  
  deleteGoal: (id) => set((state) => ({
    goals: state.goals.filter(g => g.id !== id)
  })),
  
  setBudgets: (budgets) => set({ budgets }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedMonth: (date) => set({ selectedMonth: date }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  // Computed
  getTotalIncome: () => {
    const { transactions, selectedMonth } = get()
    return transactions
      .filter(t => {
        const date = new Date(t.date)
        return t.type === 'income' && 
          date.getMonth() === selectedMonth.getMonth() &&
          date.getFullYear() === selectedMonth.getFullYear()
      })
      .reduce((sum, t) => sum + t.amount, 0)
  },
  
  getTotalExpenses: () => {
    const { transactions, selectedMonth } = get()
    return transactions
      .filter(t => {
        const date = new Date(t.date)
        return t.type === 'expense' && 
          date.getMonth() === selectedMonth.getMonth() &&
          date.getFullYear() === selectedMonth.getFullYear()
      })
      .reduce((sum, t) => sum + t.amount, 0)
  },
  
  getBalance: () => {
    return get().getTotalIncome() - get().getTotalExpenses()
  },
  
  getTransactionsByCategory: () => {
    const { transactions, selectedMonth } = get()
    const result: Record<string, number> = {}
    
    transactions
      .filter(t => {
        const date = new Date(t.date)
        return t.type === 'expense' &&
          date.getMonth() === selectedMonth.getMonth() &&
          date.getFullYear() === selectedMonth.getFullYear()
      })
      .forEach(t => {
        const catName = t.category.name
        result[catName] = (result[catName] || 0) + t.amount
      })
    
    return result
  }
}))
