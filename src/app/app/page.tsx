"use client"

import { useState, useEffect, useMemo } from "react"
import { 
  Wallet, TrendingUp, TrendingDown, PiggyBank, Plus, Trash2, 
  Home, Target, BarChart3, Settings, Heart, Calendar,
  ShoppingBag, Car, Utensils, Gamepad2, Briefcase, Gift,
  Wifi, Zap, Droplet, HeartPulse, GraduationCap, Plane,
  Building, CreditCard, DollarSign, Menu, X, ChevronLeft, ChevronRight,
  Edit2, Check, Users, Filter, Search, XCircle, ArrowUpDown, SlidersHorizontal,
  ArrowUp, ArrowDown, LineChart, Landmark, Coins, Percent, AlertCircle,
  Bitcoin, Banknote, Package
} from "lucide-react"
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts"
import { format, addMonths, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"

// Types
interface User {
  id: string
  name: string
  email: string
  color: string
}

interface Category {
  id: string
  name: string
  icon: string
  color: string
  type: 'income' | 'expense'
}

interface Transaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  date: string
  categoryId: string
  userId: string
  isRecurring: boolean
  notes?: string
}

interface Goal {
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

interface Investment {
  id: string
  ticker: string
  name: string
  type: 'stock' | 'fii' | 'etf' | 'reit' | 'crypto' | 'treasury'
  sector: string
  quantity: number
  averagePrice: number
  currentPrice: number
  investedAmount: number
  currentAmount: number
  profit: number
  profitPercent: number
  userId: string
  broker?: string
  notes?: string
}

interface Dividend {
  id: string
  investmentId: string
  ticker: string
  amount: number
  totalAmount: number
  quantity: number
  exDate: string
  paymentDate: string
  type: 'dividend' | 'jcp' | 'rendimento'
  userId: string
}

// Investment types config
const investmentTypes = {
  stock: { name: 'Ações', icon: TrendingUp, color: '#3b82f6' },
  fii: { name: 'FIIs', icon: Building, color: '#8b5cf6' },
  etf: { name: 'ETFs', icon: LineChart, color: '#06b6d4' },
  reit: { name: 'REITs', icon: Landmark, color: '#ec4899' },
  crypto: { name: 'Crypto', icon: Bitcoin, color: '#f97316' },
  treasury: { name: 'Renda Fixa', icon: Banknote, color: '#22c55e' },
}

// Sectors config
const sectors = [
  'Tecnologia', 'Financeiro', 'Saúde', 'Energia', 'Consumo', 
  'Indústria', 'Imobiliário', 'Comunicação', 'Utilidades', 'Outros'
]

// Default categories with icons and colors
const defaultCategories: Category[] = [
  { id: '1', name: 'Salário', icon: 'Briefcase', color: '#22c55e', type: 'income' },
  { id: '2', name: 'Freelance', icon: 'DollarSign', color: '#10b981', type: 'income' },
  { id: '3', name: 'Investimentos', icon: 'TrendingUp', color: '#14b8a6', type: 'income' },
  { id: '4', name: 'Alimentação', icon: 'Utensils', color: '#f97316', type: 'expense' },
  { id: '5', name: 'Transporte', icon: 'Car', color: '#3b82f6', type: 'expense' },
  { id: '6', name: 'Moradia', icon: 'Building', color: '#8b5cf6', type: 'expense' },
  { id: '7', name: 'Lazer', icon: 'Gamepad2', color: '#ec4899', type: 'expense' },
  { id: '8', name: 'Saúde', icon: 'HeartPulse', color: '#ef4444', type: 'expense' },
  { id: '9', name: 'Educação', icon: 'GraduationCap', color: '#06b6d4', type: 'expense' },
  { id: '10', name: 'Compras', icon: 'ShoppingBag', color: '#a855f7', type: 'expense' },
  { id: '11', name: 'Contas', icon: 'Zap', color: '#eab308', type: 'expense' },
  { id: '12', name: 'Viagem', icon: 'Plane', color: '#0ea5e9', type: 'expense' },
  { id: '13', name: 'Presentes', icon: 'Gift', color: '#f43f5e', type: 'expense' },
]

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase, DollarSign, TrendingUp, Utensils, Car, Building, Gamepad2,
  HeartPulse, GraduationCap, ShoppingBag, Zap, Plane, Gift, Home,
  Wallet, PiggyBank, Heart, Calendar, CreditCard, Target
}

// Demo data
const defaultUsers: User[] = [
  { id: '1', name: 'Giullia Silva', email: 'giullia@email.com', color: '#ec4899' },
  { id: '2', name: 'Pedro Santos', email: 'pedro@email.com', color: '#3b82f6' },
]

const defaultGoals: Goal[] = [
  { id: '1', name: 'Viagem de Férias', description: 'Viagem para Europa', targetAmount: 15000, currentAmount: 8500, targetDate: '2025-12-01', icon: 'Plane', color: '#0ea5e9', status: 'active' },
  { id: '2', name: 'Entrada do Apartamento', description: 'Guardar para entrada', targetAmount: 50000, currentAmount: 25000, targetDate: '2026-06-01', icon: 'Building', color: '#8b5cf6', status: 'active' },
  { id: '3', name: 'Fundo de Emergência', description: '6 meses de despesas', targetAmount: 24000, currentAmount: 24000, icon: 'Wallet', color: '#22c55e', status: 'completed' },
]

// Demo investments data
const defaultInvestments: Investment[] = [
  // Giullia's investments
  { id: '1', ticker: 'PETR4', name: 'Petrobras PN', type: 'stock', sector: 'Energia', quantity: 100, averagePrice: 32.50, currentPrice: 38.90, investedAmount: 3250, currentAmount: 3890, profit: 640, profitPercent: 19.69, userId: '1', broker: 'XP Investimentos' },
  { id: '2', ticker: 'XPML11', name: 'XP Malls FII', type: 'fii', sector: 'Imobiliário', quantity: 50, averagePrice: 102.00, currentPrice: 108.50, investedAmount: 5100, currentAmount: 5425, profit: 325, profitPercent: 6.37, userId: '1', broker: 'XP Investimentos' },
  { id: '3', ticker: 'BOVA11', name: 'iBOVESPA ETF', type: 'etf', sector: 'Outros', quantity: 30, averagePrice: 125.00, currentPrice: 118.50, investedAmount: 3750, currentAmount: 3555, profit: -195, profitPercent: -5.20, userId: '1', broker: 'Clear' },
  { id: '4', ticker: 'BBDC4', name: 'Bradesco PN', type: 'stock', sector: 'Financeiro', quantity: 80, averagePrice: 14.20, currentPrice: 15.80, investedAmount: 1136, currentAmount: 1264, profit: 128, profitPercent: 11.27, userId: '1', broker: 'XP Investimentos' },
  
  // Pedro's investments
  { id: '5', ticker: 'VALE3', name: 'Vale ON', type: 'stock', sector: 'Indústria', quantity: 150, averagePrice: 68.00, currentPrice: 72.30, investedAmount: 10200, currentAmount: 10845, profit: 645, profitPercent: 6.32, userId: '2', broker: 'Rico' },
  { id: '6', ticker: 'HGLG11', name: 'CSHG Logística', type: 'fii', sector: 'Imobiliário', quantity: 40, averagePrice: 158.00, currentPrice: 162.00, investedAmount: 6320, currentAmount: 6480, profit: 160, profitPercent: 2.53, userId: '2', broker: 'Rico' },
  { id: '7', ticker: 'BTC', name: 'Bitcoin', type: 'crypto', sector: 'Tecnologia', quantity: 0.05, averagePrice: 180000, currentPrice: 320000, investedAmount: 9000, currentAmount: 16000, profit: 7000, profitPercent: 77.78, userId: '2', broker: 'Mercado Bitcoin' },
  { id: '8', ticker: 'WEGE3', name: 'WEG ON', type: 'stock', sector: 'Indústria', quantity: 60, averagePrice: 35.00, currentPrice: 38.50, investedAmount: 2100, currentAmount: 2310, profit: 210, profitPercent: 10.00, userId: '2', broker: 'Nu Investimentos' },
  { id: '9', ticker: 'IVVB11', name: 'S&P 500 ETF', type: 'etf', sector: 'Outros', quantity: 25, averagePrice: 290.00, currentPrice: 310.00, investedAmount: 7250, currentAmount: 7750, profit: 500, profitPercent: 6.90, userId: '2', broker: 'XP Investimentos' },
]

// Demo dividends data
const defaultDividends: Dividend[] = [
  { id: '1', investmentId: '1', ticker: 'PETR4', amount: 2.50, totalAmount: 250, quantity: 100, exDate: '2025-01-15', paymentDate: '2025-01-30', type: 'dividend', userId: '1' },
  { id: '2', investmentId: '2', ticker: 'XPML11', amount: 0.85, totalAmount: 42.50, quantity: 50, exDate: '2025-01-10', paymentDate: '2025-01-15', type: 'dividend', userId: '1' },
  { id: '3', investmentId: '4', ticker: 'BBDC4', amount: 0.05, totalAmount: 4.00, quantity: 80, exDate: '2025-02-01', paymentDate: '2025-02-15', type: 'dividend', userId: '1' },
  { id: '4', investmentId: '5', ticker: 'VALE3', amount: 1.80, totalAmount: 270, quantity: 150, exDate: '2025-01-20', paymentDate: '2025-02-05', type: 'dividend', userId: '2' },
  { id: '5', investmentId: '6', ticker: 'HGLG11', amount: 1.10, totalAmount: 44, quantity: 40, exDate: '2025-01-10', paymentDate: '2025-01-15', type: 'dividend', userId: '2' },
  { id: '6', investmentId: '8', ticker: 'WEGE3', amount: 0.15, totalAmount: 9, quantity: 60, exDate: '2025-02-05', paymentDate: '2025-02-20', type: 'dividend', userId: '2' },
]

// Generate demo transactions
const generateDemoTransactions = (): Transaction[] => {
  const transactions: Transaction[] = []
  const now = new Date()
  
  // Current month transactions
  transactions.push(
    { id: '1', description: 'Salário Giullia', amount: 7500, type: 'income', date: format(now, 'yyyy-MM-05'), categoryId: '1', userId: '1', isRecurring: true },
    { id: '2', description: 'Salário Pedro', amount: 6500, type: 'income', date: format(now, 'yyyy-MM-05'), categoryId: '1', userId: '2', isRecurring: true },
    { id: '3', description: 'Aluguel', amount: 2200, type: 'expense', date: format(now, 'yyyy-MM-10'), categoryId: '6', userId: '1', isRecurring: true },
    { id: '4', description: 'Supermercado', amount: 850, type: 'expense', date: format(now, 'yyyy-MM-12'), categoryId: '4', userId: '2', isRecurring: false },
    { id: '5', description: 'Uber mensal', amount: 320, type: 'expense', date: format(now, 'yyyy-MM-15'), categoryId: '5', userId: '1', isRecurring: true },
    { id: '6', description: 'Netflix + Spotify', amount: 89, type: 'expense', date: format(now, 'yyyy-MM-08'), categoryId: '7', userId: '2', isRecurring: true },
    { id: '7', description: 'Academia', amount: 150, type: 'expense', date: format(now, 'yyyy-MM-05'), categoryId: '8', userId: '1', isRecurring: true },
    { id: '8', description: 'Curso Online', amount: 297, type: 'expense', date: format(now, 'yyyy-MM-18'), categoryId: '9', userId: '2', isRecurring: false },
    { id: '9', description: 'Luz', amount: 180, type: 'expense', date: format(now, 'yyyy-MM-12'), categoryId: '11', userId: '1', isRecurring: true },
    { id: '10', description: 'Internet', amount: 120, type: 'expense', date: format(now, 'yyyy-MM-10'), categoryId: '11', userId: '2', isRecurring: true },
    { id: '11', description: 'Freelance Design', amount: 1200, type: 'income', date: format(now, 'yyyy-MM-20'), categoryId: '2', userId: '1', isRecurring: false },
    { id: '12', description: 'Jantar Romântico', amount: 280, type: 'expense', date: format(now, 'yyyy-MM-14'), categoryId: '4', userId: '2', isRecurring: false },
    { id: '13', description: 'Presente Aniversário', amount: 350, type: 'expense', date: format(now, 'yyyy-MM-22'), categoryId: '13', userId: '1', isRecurring: false },
  )
  
  // Previous month transactions
  const prevMonth = subMonths(now, 1)
  transactions.push(
    { id: '14', description: 'Salário Giullia', amount: 7500, type: 'income', date: format(prevMonth, 'yyyy-MM-05'), categoryId: '1', userId: '1', isRecurring: true },
    { id: '15', description: 'Salário Pedro', amount: 6500, type: 'income', date: format(prevMonth, 'yyyy-MM-05'), categoryId: '1', userId: '2', isRecurring: true },
    { id: '16', description: 'Aluguel', amount: 2200, type: 'expense', date: format(prevMonth, 'yyyy-MM-10'), categoryId: '6', userId: '1', isRecurring: true },
    { id: '17', description: 'Supermercado', amount: 920, type: 'expense', date: format(prevMonth, 'yyyy-MM-15'), categoryId: '4', userId: '2', isRecurring: false },
    { id: '18', description: 'Cinema e Jantar', amount: 200, type: 'expense', date: format(prevMonth, 'yyyy-MM-20'), categoryId: '7', userId: '1', isRecurring: false },
  )
  
  return transactions
}

export default function FinanceApp() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [users] = useState<User[]>(defaultUsers)
  const [categories] = useState<Category[]>(defaultCategories)
  const [transactions, setTransactions] = useState<Transaction[]>(() => generateDemoTransactions())
  const [goals, setGoals] = useState<Goal[]>(defaultGoals)
  const [currentUser] = useState<User>(defaultUsers[0])
  
  // Dialog states
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false)
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  
  // Form states
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    categoryId: '',
    userId: currentUser.id,
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: ''
  })
  
  const [newGoal, setNewGoal] = useState({
    name: '',
    description: '',
    targetAmount: '',
    currentAmount: '0',
    targetDate: '',
    icon: 'Target',
    color: '#22c55e'
  })
  
  // Investment states
  const [investments, setInvestments] = useState<Investment[]>(defaultInvestments)
  const [dividends, setDividends] = useState<Dividend[]>(defaultDividends)
  const [isInvestmentDialogOpen, setIsInvestmentDialogOpen] = useState(false)
  const [isDividendDialogOpen, setIsDividendDialogOpen] = useState(false)
  const [showInvestmentFilters, setShowInvestmentFilters] = useState(false)
  
  // Investment filters state
  const [investmentFilters, setInvestmentFilters] = useState({
    search: '',
    type: 'all' as 'all' | 'stock' | 'fii' | 'etf' | 'reit' | 'crypto' | 'treasury',
    sector: 'all',
    userId: 'all',
    sortBy: 'value' as 'value' | 'profit' | 'profitPercent' | 'ticker',
    sortOrder: 'desc' as 'asc' | 'desc'
  })
  
  // New investment form
  const [newInvestment, setNewInvestment] = useState({
    ticker: '',
    name: '',
    type: 'stock' as 'stock' | 'fii' | 'etf' | 'reit' | 'crypto' | 'treasury',
    sector: 'Outros',
    quantity: '',
    averagePrice: '',
    currentPrice: '',
    userId: currentUser.id,
    broker: '',
    notes: ''
  })
  
  // New dividend form
  const [newDividend, setNewDividend] = useState({
    investmentId: '',
    amount: '',
    exDate: format(new Date(), 'yyyy-MM-dd'),
    paymentDate: format(new Date(), 'yyyy-MM-dd'),
    type: 'dividend' as 'dividend' | 'jcp' | 'rendimento',
    userId: currentUser.id
  })
  
  // Advanced filters state
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    type: 'all' as 'all' | 'income' | 'expense',
    categoryId: 'all',
    userId: 'all',
    minAmount: '',
    maxAmount: '',
    sortBy: 'date' as 'date' | 'amount' | 'description',
    sortOrder: 'desc' as 'asc' | 'desc'
  })

  // Filter transactions by month
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const date = new Date(t.date)
      return date.getMonth() === selectedMonth.getMonth() &&
             date.getFullYear() === selectedMonth.getFullYear()
    })
  }, [transactions, selectedMonth])
  
  // Apply advanced filters
  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...filteredTransactions]
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(t => 
        t.description.toLowerCase().includes(searchLower) ||
        (t.notes && t.notes.toLowerCase().includes(searchLower))
      )
    }
    
    // Type filter
    if (filters.type !== 'all') {
      result = result.filter(t => t.type === filters.type)
    }
    
    // Category filter
    if (filters.categoryId !== 'all') {
      result = result.filter(t => t.categoryId === filters.categoryId)
    }
    
    // User filter
    if (filters.userId !== 'all') {
      result = result.filter(t => t.userId === filters.userId)
    }
    
    // Min amount filter
    if (filters.minAmount) {
      const min = parseFloat(filters.minAmount)
      result = result.filter(t => t.amount >= min)
    }
    
    // Max amount filter
    if (filters.maxAmount) {
      const max = parseFloat(filters.maxAmount)
      result = result.filter(t => t.amount <= max)
    }
    
    // Sorting
    result.sort((a, b) => {
      let comparison = 0
      switch (filters.sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'amount':
          comparison = a.amount - b.amount
          break
        case 'description':
          comparison = a.description.localeCompare(b.description)
          break
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison
    })
    
    return result
  }, [filteredTransactions, filters])
  
  // Calculate filtered totals
  const filteredTotalIncome = useMemo(() => 
    filteredAndSortedTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    [filteredAndSortedTransactions]
  )
  
  const filteredTotalExpenses = useMemo(() => 
    filteredAndSortedTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    [filteredAndSortedTransactions]
  )
  
  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.search) count++
    if (filters.type !== 'all') count++
    if (filters.categoryId !== 'all') count++
    if (filters.userId !== 'all') count++
    if (filters.minAmount) count++
    if (filters.maxAmount) count++
    return count
  }, [filters])
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      categoryId: 'all',
      userId: 'all',
      minAmount: '',
      maxAmount: '',
      sortBy: 'date',
      sortOrder: 'desc'
    })
  }

  // Calculate totals
  const totalIncome = useMemo(() => 
    filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  )
  
  const totalExpenses = useMemo(() => 
    filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  )
  
  const balance = totalIncome - totalExpenses

  // Group expenses by category
  const expensesByCategory = useMemo(() => {
    const grouped: Record<string, number> = {}
    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const cat = categories.find(c => c.id === t.categoryId)
        if (cat) {
          grouped[cat.name] = (grouped[cat.name] || 0) + t.amount
        }
      })
    return Object.entries(grouped).map(([name, value]) => {
      const cat = categories.find(c => c.name === name)
      return { name, value, color: cat?.color || '#6366f1' }
    })
  }, [filteredTransactions, categories])

  // Transactions by user
  const expensesByUser = useMemo(() => {
    const result: { name: string; value: number; color: string }[] = []
    users.forEach(user => {
      const total = filteredTransactions
        .filter(t => t.type === 'expense' && t.userId === user.id)
        .reduce((sum, t) => sum + t.amount, 0)
      result.push({ name: user.name.split(' ')[0], value: total, color: user.color })
    })
    return result
  }, [filteredTransactions, users])

  // Monthly comparison data
  const monthlyData = useMemo(() => {
    const months = []
    for (let i = 5; i >= 0; i--) {
      const month = subMonths(new Date(), i)
      const monthTransactions = transactions.filter(t => {
        const date = new Date(t.date)
        return date.getMonth() === month.getMonth() &&
               date.getFullYear() === month.getFullYear()
      })
      const income = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
      const expenses = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
      months.push({
        name: format(month, 'MMM', { locale: ptBR }),
        Receitas: income,
        Despesas: expenses
      })
    }
    return months
  }, [transactions])

  // Investment calculations
  const filteredAndSortedInvestments = useMemo(() => {
    let result = [...investments]
    
    // Search filter
    if (investmentFilters.search) {
      const searchLower = investmentFilters.search.toLowerCase()
      result = result.filter(i => 
        i.ticker.toLowerCase().includes(searchLower) ||
        i.name.toLowerCase().includes(searchLower)
      )
    }
    
    // Type filter
    if (investmentFilters.type !== 'all') {
      result = result.filter(i => i.type === investmentFilters.type)
    }
    
    // Sector filter
    if (investmentFilters.sector !== 'all') {
      result = result.filter(i => i.sector === investmentFilters.sector)
    }
    
    // User filter
    if (investmentFilters.userId !== 'all') {
      result = result.filter(i => i.userId === investmentFilters.userId)
    }
    
    // Sorting
    result.sort((a, b) => {
      let comparison = 0
      switch (investmentFilters.sortBy) {
        case 'value':
          comparison = a.currentAmount - b.currentAmount
          break
        case 'profit':
          comparison = a.profit - b.profit
          break
        case 'profitPercent':
          comparison = a.profitPercent - b.profitPercent
          break
        case 'ticker':
          comparison = a.ticker.localeCompare(b.ticker)
          break
      }
      return investmentFilters.sortOrder === 'desc' ? -comparison : comparison
    })
    
    return result
  }, [investments, investmentFilters])
  
  // Investment summary
  const totalInvested = useMemo(() => 
    filteredAndSortedInvestments.reduce((sum, i) => sum + i.investedAmount, 0),
    [filteredAndSortedInvestments]
  )
  
  const totalCurrentValue = useMemo(() => 
    filteredAndSortedInvestments.reduce((sum, i) => sum + i.currentAmount, 0),
    [filteredAndSortedInvestments]
  )
  
  const totalProfit = useMemo(() => 
    filteredAndSortedInvestments.reduce((sum, i) => sum + i.profit, 0),
    [filteredAndSortedInvestments]
  )
  
  const totalProfitPercent = useMemo(() => 
    totalInvested > 0 ? ((totalProfit / totalInvested) * 100) : 0,
    [totalInvested, totalProfit]
  )
  
  const totalDividends = useMemo(() => {
    const filteredDividends = dividends.filter(d => {
      if (investmentFilters.userId !== 'all') {
        return d.userId === investmentFilters.userId
      }
      return true
    })
    return filteredDividends.reduce((sum, d) => sum + d.totalAmount, 0)
  }, [dividends, investmentFilters.userId])
  
  // Investments by type for chart
  const investmentsByType = useMemo(() => {
    const grouped: Record<string, number> = {}
    filteredAndSortedInvestments.forEach(i => {
      grouped[i.type] = (grouped[i.type] || 0) + i.currentAmount
    })
    return Object.entries(grouped).map(([type, value]) => ({
      name: investmentTypes[type as keyof typeof investmentTypes]?.name || type,
      value,
      color: investmentTypes[type as keyof typeof investmentTypes]?.color || '#6366f1'
    }))
  }, [filteredAndSortedInvestments])
  
  // Investments by sector for chart
  const investmentsBySector = useMemo(() => {
    const grouped: Record<string, number> = {}
    filteredAndSortedInvestments.forEach(i => {
      grouped[i.sector] = (grouped[i.sector] || 0) + i.currentAmount
    })
    return Object.entries(grouped).map(([name, value]) => {
      const colors: Record<string, string> = {
        'Tecnologia': '#3b82f6',
        'Financeiro': '#22c55e',
        'Saúde': '#ef4444',
        'Energia': '#f97316',
        'Consumo': '#ec4899',
        'Indústria': '#8b5cf6',
        'Imobiliário': '#06b6d4',
        'Comunicação': '#eab308',
        'Utilidades': '#14b8a6',
        'Outros': '#6366f1'
      }
      return { name, value, color: colors[name] || '#6366f1' }
    })
  }, [filteredAndSortedInvestments])
  
  // Investments by user
  const investmentsByUser = useMemo(() => {
    const result: { name: string; value: number; invested: number; color: string }[] = []
    users.forEach(user => {
      const userInvestments = filteredAndSortedInvestments.filter(i => i.userId === user.id)
      result.push({
        name: user.name.split(' ')[0],
        value: userInvestments.reduce((sum, i) => sum + i.currentAmount, 0),
        invested: userInvestments.reduce((sum, i) => sum + i.investedAmount, 0),
        color: user.color
      })
    })
    return result
  }, [filteredAndSortedInvestments, users])
  
  // Investment active filters count
  const activeInvestmentFiltersCount = useMemo(() => {
    let count = 0
    if (investmentFilters.search) count++
    if (investmentFilters.type !== 'all') count++
    if (investmentFilters.sector !== 'all') count++
    if (investmentFilters.userId !== 'all') count++
    return count
  }, [investmentFilters])
  
  // Clear investment filters
  const clearInvestmentFilters = () => {
    setInvestmentFilters({
      search: '',
      type: 'all',
      sector: 'all',
      userId: 'all',
      sortBy: 'value',
      sortOrder: 'desc'
    })
  }

  // Handlers
  const handleAddTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount || !newTransaction.categoryId) return
    
    const transaction: Transaction = {
      id: Date.now().toString(),
      description: newTransaction.description,
      amount: parseFloat(newTransaction.amount),
      type: newTransaction.type,
      categoryId: newTransaction.categoryId,
      userId: newTransaction.userId,
      date: newTransaction.date,
      isRecurring: false,
      notes: newTransaction.notes
    }
    
    setTransactions(prev => [transaction, ...prev])
    setNewTransaction({
      description: '',
      amount: '',
      type: 'expense',
      categoryId: '',
      userId: currentUser.id,
      date: format(new Date(), 'yyyy-MM-dd'),
      notes: ''
    })
    setIsTransactionDialogOpen(false)
  }

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount) return
    
    const goal: Goal = {
      id: Date.now().toString(),
      name: newGoal.name,
      description: newGoal.description,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount) || 0,
      targetDate: newGoal.targetDate,
      icon: newGoal.icon,
      color: newGoal.color,
      status: 'active'
    }
    
    setGoals(prev => [...prev, goal])
    setNewGoal({
      name: '',
      description: '',
      targetAmount: '',
      currentAmount: '0',
      targetDate: '',
      icon: 'Target',
      color: '#22c55e'
    })
    setIsGoalDialogOpen(false)
  }

  const handleUpdateGoalAmount = (id: string, amount: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        const newAmount = g.currentAmount + amount
        return {
          ...g,
          currentAmount: Math.min(newAmount, g.targetAmount),
          status: newAmount >= g.targetAmount ? 'completed' : 'active'
        }
      }
      return g
    }))
  }

  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id))
  }

  // Investment handlers
  const handleAddInvestment = () => {
    if (!newInvestment.ticker || !newInvestment.name || !newInvestment.quantity || !newInvestment.averagePrice) return
    
    const quantity = parseFloat(newInvestment.quantity)
    const averagePrice = parseFloat(newInvestment.averagePrice)
    const currentPrice = parseFloat(newInvestment.currentPrice) || averagePrice
    const investedAmount = quantity * averagePrice
    const currentAmount = quantity * currentPrice
    const profit = currentAmount - investedAmount
    const profitPercent = investedAmount > 0 ? (profit / investedAmount) * 100 : 0
    
    const investment: Investment = {
      id: Date.now().toString(),
      ticker: newInvestment.ticker.toUpperCase(),
      name: newInvestment.name,
      type: newInvestment.type,
      sector: newInvestment.sector,
      quantity,
      averagePrice,
      currentPrice,
      investedAmount,
      currentAmount,
      profit,
      profitPercent,
      userId: newInvestment.userId,
      broker: newInvestment.broker,
      notes: newInvestment.notes
    }
    
    setInvestments(prev => [...prev, investment])
    setNewInvestment({
      ticker: '',
      name: '',
      type: 'stock',
      sector: 'Outros',
      quantity: '',
      averagePrice: '',
      currentPrice: '',
      userId: currentUser.id,
      broker: '',
      notes: ''
    })
    setIsInvestmentDialogOpen(false)
  }
  
  const handleDeleteInvestment = (id: string) => {
    setInvestments(prev => prev.filter(i => i.id !== id))
  }
  
  const handleAddDividend = () => {
    if (!newDividend.investmentId || !newDividend.amount) return
    
    const investment = investments.find(i => i.id === newDividend.investmentId)
    if (!investment) return
    
    const amount = parseFloat(newDividend.amount)
    const totalAmount = amount * investment.quantity
    
    const dividend: Dividend = {
      id: Date.now().toString(),
      investmentId: newDividend.investmentId,
      ticker: investment.ticker,
      amount,
      totalAmount,
      quantity: investment.quantity,
      exDate: newDividend.exDate,
      paymentDate: newDividend.paymentDate,
      type: newDividend.type,
      userId: newDividend.userId
    }
    
    setDividends(prev => [...prev, dividend])
    setNewDividend({
      investmentId: '',
      amount: '',
      exDate: format(new Date(), 'yyyy-MM-dd'),
      paymentDate: format(new Date(), 'yyyy-MM-dd'),
      type: 'dividend',
      userId: currentUser.id
    })
    setIsDividendDialogOpen(false)
  }

  const getCategoryIcon = (iconName: string) => iconMap[iconName] || Wallet
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500" />
            <span className="font-bold text-lg">Finanças do Casal</span>
          </div>
          <div className="w-10" />
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-rose-500" />
                  <span className="font-bold">Menu</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="p-4 space-y-2">
                {[
                  { id: 'dashboard', icon: Home, label: 'Dashboard' },
                  { id: 'transactions', icon: CreditCard, label: 'Transações' },
                  { id: 'investments', icon: LineChart, label: 'Investimentos' },
                  { id: 'goals', icon: Target, label: 'Metas' },
                  { id: 'reports', icon: BarChart3, label: 'Relatórios' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false) }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      activeTab === item.id 
                        ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 min-h-screen fixed left-0 top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-r border-slate-200 dark:border-slate-800">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-xl">
                <Heart className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Finanças do Casal</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Gestão financeira juntos</p>
              </div>
            </div>
          </div>

          {/* Couple Avatar */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {users.map(user => (
                  <div
                    key={user.id}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm ring-2 ring-white dark:ring-slate-900"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.name.charAt(0)}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-medium">Giullia & Pedro</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Juntos desde 2023</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {[
              { id: 'dashboard', icon: Home, label: 'Dashboard' },
              { id: 'transactions', icon: CreditCard, label: 'Transações' },
              { id: 'investments', icon: LineChart, label: 'Investimentos' },
              { id: 'goals', icon: Target, label: 'Metas' },
              { id: 'reports', icon: BarChart3, label: 'Relatórios' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400">
              <Settings className="w-5 h-5" />
              <span>Configurações</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
          <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            {/* Month Selector */}
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedMonth(prev => subMonths(prev, 1))}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl lg:text-2xl font-bold">
                  {format(selectedMonth, 'MMMM yyyy', { locale: ptBR })}
                </h2>
                <button
                  onClick={() => setSelectedMonth(prev => addMonths(prev, 1))}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              
              <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-rose-500 hover:bg-rose-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Nova Transação</span>
                    <span className="sm:hidden">Nova</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Nova Transação</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="flex gap-2">
                      <Button
                        variant={newTransaction.type === 'income' ? 'default' : 'outline'}
                        className={`flex-1 ${newTransaction.type === 'income' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                        onClick={() => setNewTransaction(prev => ({ ...prev, type: 'income', categoryId: '' }))}
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Receita
                      </Button>
                      <Button
                        variant={newTransaction.type === 'expense' ? 'default' : 'outline'}
                        className={`flex-1 ${newTransaction.type === 'expense' ? 'bg-rose-500 hover:bg-rose-600' : ''}`}
                        onClick={() => setNewTransaction(prev => ({ ...prev, type: 'expense', categoryId: '' }))}
                      >
                        <TrendingDown className="w-4 h-4 mr-2" />
                        Despesa
                      </Button>
                    </div>
                    
                    <Input
                      placeholder="Descrição"
                      value={newTransaction.description}
                      onChange={e => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                    />
                    
                    <Input
                      type="number"
                      placeholder="Valor (R$)"
                      value={newTransaction.amount}
                      onChange={e => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                    />
                    
                    <Select
                      value={newTransaction.categoryId}
                      onValueChange={value => setNewTransaction(prev => ({ ...prev, categoryId: value }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories
                          .filter(c => c.type === newTransaction.type)
                          .map(cat => {
                            const Icon = getCategoryIcon(cat.icon)
                            return (
                              <SelectItem key={cat.id} value={cat.id}>
                                <div className="flex items-center gap-2">
                                  <Icon className="w-4 h-4" style={{ color: cat.color }} />
                                  {cat.name}
                                </div>
                              </SelectItem>
                            )
                          })}
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={newTransaction.userId}
                      onValueChange={value => setNewTransaction(prev => ({ ...prev, userId: value }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Quem?" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: user.color }} 
                              />
                              {user.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Input
                      type="date"
                      value={newTransaction.date}
                      onChange={e => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
                    />
                    
                    <Input
                      placeholder="Observações (opcional)"
                      value={newTransaction.notes}
                      onChange={e => setNewTransaction(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsTransactionDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddTransaction} className="bg-rose-500 hover:bg-rose-600">
                      Adicionar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Receitas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl lg:text-3xl font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(totalIncome)}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border-rose-200 dark:border-rose-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-rose-700 dark:text-rose-400 flex items-center gap-2">
                        <TrendingDown className="w-4 h-4" />
                        Despesas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl lg:text-3xl font-bold text-rose-600 dark:text-rose-400">
                        {formatCurrency(totalExpenses)}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className={`bg-gradient-to-br ${balance >= 0 ? 'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800' : 'from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-red-200 dark:border-red-800'}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className={`text-sm font-medium ${balance >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-red-700 dark:text-red-400'} flex items-center gap-2`}>
                        <Wallet className="w-4 h-4" />
                        Saldo
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className={`text-2xl lg:text-3xl font-bold ${balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(balance)}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border-purple-200 dark:border-purple-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400 flex items-center gap-2">
                        <PiggyBank className="w-4 h-4" />
                        Metas Ativas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl lg:text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {goals.filter(g => g.status === 'active').length}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Expenses by Category */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="w-5 h-5" />
                        Despesas por Categoria
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {expensesByCategory.length > 0 ? (
                        <div className="flex flex-col">
                          <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={expensesByCategory}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={50}
                                  outerRadius={70}
                                  paddingAngle={2}
                                  dataKey="value"
                                >
                                  {expensesByCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip 
                                  formatter={(value: number) => formatCurrency(value)}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          {/* Custom Legend */}
                          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                            {expensesByCategory.map((entry, index) => {
                              const percent = totalExpenses > 0 ? ((entry.value / totalExpenses) * 100).toFixed(0) : 0
                              return (
                                <div key={index} className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded-sm flex-shrink-0"
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  <span className="text-sm text-slate-600 dark:text-slate-300 truncate">
                                    {entry.name}
                                  </span>
                                  <span className="text-sm font-medium text-slate-900 dark:text-white ml-auto">
                                    {percent}%
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="h-64 flex items-center justify-center text-slate-500">
                          Sem despesas neste mês
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Expenses by User */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Despesas por Pessoa
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {expensesByUser.length > 0 ? (
                        <div className="flex flex-col">
                          <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={expensesByUser}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={50}
                                  outerRadius={70}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                  {expensesByUser.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip 
                                  formatter={(value: number) => formatCurrency(value)}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          {/* Custom Legend */}
                          <div className="space-y-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                            {expensesByUser.map((entry, index) => {
                              const percent = totalExpenses > 0 ? ((entry.value / totalExpenses) * 100).toFixed(0) : 0
                              return (
                                <div key={index} className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded-sm flex-shrink-0"
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  <span className="text-sm text-slate-600 dark:text-slate-300">
                                    {entry.name}
                                  </span>
                                  <span className="text-sm text-slate-500">-</span>
                                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                                    {formatCurrency(entry.value)}
                                  </span>
                                  <span className="text-sm text-slate-500 ml-auto">
                                    ({percent}%)
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="h-64 flex items-center justify-center text-slate-500">
                          Sem despesas neste mês
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Transactions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Transações Recentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {filteredTransactions.slice(0, 10).map(transaction => {
                        const category = categories.find(c => c.id === transaction.categoryId)
                        const user = users.find(u => u.id === transaction.userId)
                        const Icon = category ? getCategoryIcon(category.icon) : Wallet
                        
                        return (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div 
                                className="p-2 rounded-lg"
                                style={{ backgroundColor: `${category?.color}20` }}
                              >
                                <Icon className="w-5 h-5" style={{ color: category?.color }} />
                              </div>
                              <div>
                                <p className="font-medium">{transaction.description}</p>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                  <span>{category?.name}</span>
                                  <span>•</span>
                                  <div 
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: user?.color }}
                                  />
                                  <span>{user?.name.split(' ')[0]}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-500' : 'text-rose-500'}`}>
                                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                              </p>
                              <p className="text-xs text-slate-500">
                                {format(new Date(transaction.date), 'dd/MM', { locale: ptBR })}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                      {filteredTransactions.length === 0 && (
                        <div className="text-center py-8 text-slate-500">
                          Nenhuma transação neste mês
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="space-y-6">
                {/* Filters Card */}
                <Card className="border-slate-200 dark:border-slate-800">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <SlidersHorizontal className="w-5 h-5" />
                          Filtros Avançados
                        </CardTitle>
                        {activeFiltersCount > 0 && (
                          <span className="px-2.5 py-0.5 text-xs font-medium bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 rounded-full">
                            {activeFiltersCount} ativo{activeFiltersCount > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {activeFiltersCount > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="text-slate-500 hover:text-slate-700"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Limpar filtros
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowFilters(!showFilters)}
                          className="text-slate-500 hover:text-slate-700"
                        >
                          {showFilters ? 'Ocultar' : 'Mostrar'} filtros
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <AnimatePresence>
                    {showFilters && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <CardContent className="pt-0 border-t border-slate-200 dark:border-slate-800">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                            {/* Search */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Buscar</label>
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                  placeholder="Descrição ou notas..."
                                  value={filters.search}
                                  onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                  className="pl-9"
                                />
                              </div>
                            </div>
                            
                            {/* Type */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tipo</label>
                              <Select
                                value={filters.type}
                                onValueChange={value => setFilters(prev => ({ ...prev, type: value as any }))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">Todos</SelectItem>
                                  <SelectItem value="income">
                                    <div className="flex items-center gap-2">
                                      <TrendingUp className="w-4 h-4 text-green-500" />
                                      Receitas
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="expense">
                                    <div className="flex items-center gap-2">
                                      <TrendingDown className="w-4 h-4 text-rose-500" />
                                      Despesas
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {/* Category */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Categoria</label>
                              <Select
                                value={filters.categoryId}
                                onValueChange={value => setFilters(prev => ({ ...prev, categoryId: value }))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Todas" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">Todas</SelectItem>
                                  {categories.map(cat => {
                                    const Icon = getCategoryIcon(cat.icon)
                                    return (
                                      <SelectItem key={cat.id} value={cat.id}>
                                        <div className="flex items-center gap-2">
                                          <Icon className="w-4 h-4" style={{ color: cat.color }} />
                                          {cat.name}
                                        </div>
                                      </SelectItem>
                                    )
                                  })}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {/* User */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pessoa</label>
                              <Select
                                value={filters.userId}
                                onValueChange={value => setFilters(prev => ({ ...prev, userId: value }))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">Todos</SelectItem>
                                  {users.map(user => (
                                    <SelectItem key={user.id} value={user.id}>
                                      <div className="flex items-center gap-2">
                                        <div 
                                          className="w-3 h-3 rounded-full"
                                          style={{ backgroundColor: user.color }}
                                        />
                                        {user.name}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {/* Min Amount */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Valor Mínimo</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">R$</span>
                                <Input
                                  type="number"
                                  placeholder="0,00"
                                  value={filters.minAmount}
                                  onChange={e => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
                                  className="pl-10"
                                />
                              </div>
                            </div>
                            
                            {/* Max Amount */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Valor Máximo</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">R$</span>
                                <Input
                                  type="number"
                                  placeholder="0,00"
                                  value={filters.maxAmount}
                                  onChange={e => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
                                  className="pl-10"
                                />
                              </div>
                            </div>
                            
                            {/* Sort By */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Ordenar por</label>
                              <Select
                                value={filters.sortBy}
                                onValueChange={value => setFilters(prev => ({ ...prev, sortBy: value as any }))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="date">Data</SelectItem>
                                  <SelectItem value="amount">Valor</SelectItem>
                                  <SelectItem value="description">Descrição</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {/* Sort Order */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Ordem</label>
                              <div className="flex gap-2">
                                <Button
                                  variant={filters.sortOrder === 'asc' ? 'default' : 'outline'}
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => setFilters(prev => ({ ...prev, sortOrder: 'asc' }))}
                                >
                                  <ArrowUp className="w-4 h-4 mr-1" />
                                  Crescente
                                </Button>
                                <Button
                                  variant={filters.sortOrder === 'desc' ? 'default' : 'outline'}
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => setFilters(prev => ({ ...prev, sortOrder: 'desc' }))}
                                >
                                  <ArrowDown className="w-4 h-4 mr-1" />
                                  Decrescente
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
                
                {/* Results Summary */}
                {(activeFiltersCount > 0 || filters.sortBy !== 'date' || filters.sortOrder !== 'desc') && (
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-500">
                        {filteredAndSortedTransactions.length} de {filteredTransactions.length} transações
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                          <TrendingUp className="w-4 h-4" />
                          {formatCurrency(filteredTotalIncome)}
                        </span>
                        <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                          <TrendingDown className="w-4 h-4" />
                          {formatCurrency(filteredTotalExpenses)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Transactions List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Todas as Transações</CardTitle>
                    <CardDescription>
                      {filteredAndSortedTransactions.length} transações em {format(selectedMonth, 'MMMM yyyy', { locale: ptBR })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {filteredAndSortedTransactions.map(transaction => {
                        const category = categories.find(c => c.id === transaction.categoryId)
                        const user = users.find(u => u.id === transaction.userId)
                        const Icon = category ? getCategoryIcon(category.icon) : Wallet
                        
                        return (
                          <motion.div
                            key={transaction.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                          >
                            <div className="flex items-center gap-4">
                              <div 
                                className="p-3 rounded-xl"
                                style={{ backgroundColor: `${category?.color}20` }}
                              >
                                <Icon className="w-6 h-6" style={{ color: category?.color }} />
                              </div>
                              <div>
                                <p className="font-medium text-lg">{transaction.description}</p>
                                <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    transaction.type === 'income' 
                                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                      : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                                  }`}>
                                    {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                                  </span>
                                  <span>•</span>
                                  <span>{category?.name}</span>
                                  <span>•</span>
                                  <div 
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: user?.color }}
                                  />
                                  <span>{user?.name}</span>
                                  <span>•</span>
                                  <span>{format(new Date(transaction.date), "dd 'de' MMMM", { locale: ptBR })}</span>
                                </div>
                                {transaction.notes && (
                                  <p className="text-sm text-slate-400 mt-1">{transaction.notes}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <p className={`text-xl font-bold ${transaction.type === 'income' ? 'text-green-500' : 'text-rose-500'}`}>
                                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                              </p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                onClick={() => handleDeleteTransaction(transaction.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </motion.div>
                        )
                      })}
                      {filteredAndSortedTransactions.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                          <Filter className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p className="text-lg font-medium">Nenhuma transação encontrada</p>
                          <p className="text-sm">Tente ajustar os filtros ou adicione novas transações</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Investments Tab */}
            {activeTab === 'investments' && (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400 flex items-center gap-2">
                        <PiggyBank className="w-4 h-4" />
                        Total Investido
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(totalInvested)}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border-purple-200 dark:border-purple-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400 flex items-center gap-2">
                        <LineChart className="w-4 h-4" />
                        Valor Atual
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl lg:text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {formatCurrency(totalCurrentValue)}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className={`bg-gradient-to-br ${totalProfit >= 0 ? 'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800' : 'from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border-red-200 dark:border-red-800'}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className={`text-sm font-medium ${totalProfit >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'} flex items-center gap-2`}>
                        {totalProfit >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        Lucro/Prejuízo
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className={`text-2xl lg:text-3xl font-bold ${totalProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}
                      </p>
                      <p className={`text-sm ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {totalProfitPercent >= 0 ? '+' : ''}{totalProfitPercent.toFixed(2)}%
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-amber-200 dark:border-amber-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-400 flex items-center gap-2">
                        <Coins className="w-4 h-4" />
                        Dividendos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl lg:text-3xl font-bold text-amber-600 dark:text-amber-400">
                        {formatCurrency(totalDividends)}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Filters Card */}
                <Card className="border-slate-200 dark:border-slate-800">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <SlidersHorizontal className="w-5 h-5" />
                          Filtros de Investimentos
                        </CardTitle>
                        {activeInvestmentFiltersCount > 0 && (
                          <span className="px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                            {activeInvestmentFiltersCount} ativo{activeInvestmentFiltersCount > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {activeInvestmentFiltersCount > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearInvestmentFilters}
                            className="text-slate-500 hover:text-slate-700"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Limpar
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowInvestmentFilters(!showInvestmentFilters)}
                          className="text-slate-500 hover:text-slate-700"
                        >
                          {showInvestmentFilters ? 'Ocultar' : 'Mostrar'} filtros
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <AnimatePresence>
                    {showInvestmentFilters && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <CardContent className="pt-0 border-t border-slate-200 dark:border-slate-800">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                            {/* Search */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Buscar</label>
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                  placeholder="Ticker ou nome..."
                                  value={investmentFilters.search}
                                  onChange={e => setInvestmentFilters(prev => ({ ...prev, search: e.target.value }))}
                                  className="pl-9"
                                />
                              </div>
                            </div>
                            
                            {/* Type */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tipo de Ativo</label>
                              <Select
                                value={investmentFilters.type}
                                onValueChange={value => setInvestmentFilters(prev => ({ ...prev, type: value as any }))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">Todos</SelectItem>
                                  {Object.entries(investmentTypes).map(([key, { name, color }]) => (
                                    <SelectItem key={key} value={key}>
                                      <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                                        {name}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {/* Sector */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Setor</label>
                              <Select
                                value={investmentFilters.sector}
                                onValueChange={value => setInvestmentFilters(prev => ({ ...prev, sector: value }))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">Todos</SelectItem>
                                  {sectors.map(sector => (
                                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {/* User */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pessoa</label>
                              <Select
                                value={investmentFilters.userId}
                                onValueChange={value => setInvestmentFilters(prev => ({ ...prev, userId: value }))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">Todos</SelectItem>
                                  {users.map(user => (
                                    <SelectItem key={user.id} value={user.id}>
                                      <div className="flex items-center gap-2">
                                        <div 
                                          className="w-3 h-3 rounded-full"
                                          style={{ backgroundColor: user.color }}
                                        />
                                        {user.name}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {/* Sort By */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Ordenar por</label>
                              <Select
                                value={investmentFilters.sortBy}
                                onValueChange={value => setInvestmentFilters(prev => ({ ...prev, sortBy: value as any }))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="value">Valor Atual</SelectItem>
                                  <SelectItem value="profit">Lucro/Prejuízo</SelectItem>
                                  <SelectItem value="profitPercent">% Lucro</SelectItem>
                                  <SelectItem value="ticker">Ticker</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {/* Sort Order */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Ordem</label>
                              <div className="flex gap-2">
                                <Button
                                  variant={investmentFilters.sortOrder === 'asc' ? 'default' : 'outline'}
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => setInvestmentFilters(prev => ({ ...prev, sortOrder: 'asc' }))}
                                >
                                  <ArrowUp className="w-4 h-4 mr-1" />
                                  Crescente
                                </Button>
                                <Button
                                  variant={investmentFilters.sortOrder === 'desc' ? 'default' : 'outline'}
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => setInvestmentFilters(prev => ({ ...prev, sortOrder: 'desc' }))}
                                >
                                  <ArrowDown className="w-4 h-4 mr-1" />
                                  Decrescente
                                </Button>
                              </div>
                            </div>
                            
                            {/* Add Investment Button */}
                            <div className="space-y-2 sm:col-span-2">
                              <label className="text-sm font-medium text-transparent">Ações</label>
                              <div className="flex gap-2">
                                <Dialog open={isInvestmentDialogOpen} onOpenChange={setIsInvestmentDialogOpen}>
                                  <DialogTrigger asChild>
                                    <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                                      <Plus className="w-4 h-4 mr-2" />
                                      Novo Investimento
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>Novo Investimento</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <Input
                                          placeholder="Ticker (ex: PETR4)"
                                          value={newInvestment.ticker}
                                          onChange={e => setNewInvestment(prev => ({ ...prev, ticker: e.target.value }))}
                                        />
                                        <Select
                                          value={newInvestment.type}
                                          onValueChange={value => setNewInvestment(prev => ({ ...prev, type: value as any }))}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {Object.entries(investmentTypes).map(([key, { name }]) => (
                                              <SelectItem key={key} value={key}>{name}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <Input
                                        placeholder="Nome da empresa/fundo"
                                        value={newInvestment.name}
                                        onChange={e => setNewInvestment(prev => ({ ...prev, name: e.target.value }))}
                                      />
                                      <div className="grid grid-cols-2 gap-4">
                                        <Select
                                          value={newInvestment.sector}
                                          onValueChange={value => setNewInvestment(prev => ({ ...prev, sector: value }))}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Setor" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {sectors.map(sector => (
                                              <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        <Select
                                          value={newInvestment.userId}
                                          onValueChange={value => setNewInvestment(prev => ({ ...prev, userId: value }))}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Dono" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {users.map(user => (
                                              <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="grid grid-cols-3 gap-4">
                                        <Input
                                          type="number"
                                          placeholder="Qtd"
                                          value={newInvestment.quantity}
                                          onChange={e => setNewInvestment(prev => ({ ...prev, quantity: e.target.value }))}
                                        />
                                        <Input
                                          type="number"
                                          placeholder="Preço Médio"
                                          value={newInvestment.averagePrice}
                                          onChange={e => setNewInvestment(prev => ({ ...prev, averagePrice: e.target.value }))}
                                        />
                                        <Input
                                          type="number"
                                          placeholder="Preço Atual"
                                          value={newInvestment.currentPrice}
                                          onChange={e => setNewInvestment(prev => ({ ...prev, currentPrice: e.target.value }))}
                                        />
                                      </div>
                                      <Input
                                        placeholder="Corretora (opcional)"
                                        value={newInvestment.broker}
                                        onChange={e => setNewInvestment(prev => ({ ...prev, broker: e.target.value }))}
                                      />
                                    </div>
                                    <DialogFooter>
                                      <Button variant="outline" onClick={() => setIsInvestmentDialogOpen(false)}>
                                        Cancelar
                                      </Button>
                                      <Button onClick={handleAddInvestment} className="bg-blue-500 hover:bg-blue-600">
                                        Adicionar
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                
                                <Dialog open={isDividendDialogOpen} onOpenChange={setIsDividendDialogOpen}>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" className="flex-1">
                                      <Coins className="w-4 h-4 mr-2" />
                                      Registrar Dividendo
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Registrar Dividendo</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                      <Select
                                        value={newDividend.investmentId}
                                        onValueChange={value => setNewDividend(prev => ({ ...prev, investmentId: value }))}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecione o ativo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {investments.map(inv => (
                                            <SelectItem key={inv.id} value={inv.id}>
                                              {inv.ticker} - {inv.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <div className="grid grid-cols-2 gap-4">
                                        <Input
                                          type="number"
                                          placeholder="Valor por cota"
                                          value={newDividend.amount}
                                          onChange={e => setNewDividend(prev => ({ ...prev, amount: e.target.value }))}
                                        />
                                        <Select
                                          value={newDividend.type}
                                          onValueChange={value => setNewDividend(prev => ({ ...prev, type: value as any }))}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="dividend">Dividendo</SelectItem>
                                            <SelectItem value="jcp">JCP</SelectItem>
                                            <SelectItem value="rendimento">Rendimento</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <Input
                                          type="date"
                                          value={newDividend.exDate}
                                          onChange={e => setNewDividend(prev => ({ ...prev, exDate: e.target.value }))}
                                        />
                                        <Input
                                          type="date"
                                          value={newDividend.paymentDate}
                                          onChange={e => setNewDividend(prev => ({ ...prev, paymentDate: e.target.value }))}
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button variant="outline" onClick={() => setIsDividendDialogOpen(false)}>
                                        Cancelar
                                      </Button>
                                      <Button onClick={handleAddDividend} className="bg-amber-500 hover:bg-amber-600">
                                        Registrar
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
                
                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* By Type */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="w-5 h-5" />
                        Por Tipo de Ativo
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {investmentsByType.length > 0 ? (
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={investmentsByType}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {investmentsByType.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value: number) => formatCurrency(value)} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="h-64 flex items-center justify-center text-slate-500">
                          Sem investimentos
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* By Sector */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Por Setor
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {investmentsBySector.length > 0 ? (
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={investmentsBySector}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {investmentsBySector.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value: number) => formatCurrency(value)} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="h-64 flex items-center justify-center text-slate-500">
                          Sem investimentos
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                {/* Investments List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Carteira de Investimentos</CardTitle>
                    <CardDescription>
                      {filteredAndSortedInvestments.length} ativo{filteredAndSortedInvestments.length !== 1 ? 's' : ''} • Total: {formatCurrency(totalCurrentValue)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {filteredAndSortedInvestments.map(investment => {
                        const TypeIcon = investmentTypes[investment.type]?.icon || TrendingUp
                        const typeColor = investmentTypes[investment.type]?.color || '#6366f1'
                        const user = users.find(u => u.id === investment.userId)
                        
                        return (
                          <motion.div
                            key={investment.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                          >
                            <div className="flex items-center gap-4">
                              <div 
                                className="p-3 rounded-xl"
                                style={{ backgroundColor: `${typeColor}20` }}
                              >
                                <TypeIcon className="w-6 h-6" style={{ color: typeColor }} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-lg">{investment.ticker}</p>
                                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                    {investmentTypes[investment.type]?.name}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-500">{investment.name}</p>
                                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                  <span>{investment.sector}</span>
                                  <span>•</span>
                                  <div 
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: user?.color }}
                                  />
                                  <span>{user?.name.split(' ')[0]}</span>
                                  {investment.broker && (
                                    <>
                                      <span>•</span>
                                      <span>{investment.broker}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold">{formatCurrency(investment.currentAmount)}</p>
                              <div className="flex items-center justify-end gap-2">
                                <span className={`text-sm font-medium ${investment.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                  {investment.profit >= 0 ? '+' : ''}{formatCurrency(investment.profit)}
                                </span>
                                <span className={`text-xs px-1.5 py-0.5 rounded ${investment.profitPercent >= 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                  {investment.profitPercent >= 0 ? '+' : ''}{investment.profitPercent.toFixed(2)}%
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">
                                {investment.quantity} cotas @ {formatCurrency(investment.currentPrice)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                              onClick={() => handleDeleteInvestment(investment.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        )
                      })}
                      {filteredAndSortedInvestments.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                          <LineChart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p className="text-lg font-medium">Nenhum investimento encontrado</p>
                          <p className="text-sm">Adicione seu primeiro investimento ou ajuste os filtros</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Dividends History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="w-5 h-5" />
                      Histórico de Dividendos
                    </CardTitle>
                    <CardDescription>
                      Total recebido: {formatCurrency(totalDividends)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {dividends
                        .filter(d => investmentFilters.userId === 'all' || d.userId === investmentFilters.userId)
                        .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
                        .map(dividend => {
                          const user = users.find(u => u.id === dividend.userId)
                          return (
                            <div key={dividend.id} className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                                  <Coins className="w-4 h-4 text-amber-600" />
                                </div>
                                <div>
                                  <p className="font-medium">{dividend.ticker}</p>
                                  <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span>{dividend.quantity} cotas × {formatCurrency(dividend.amount)}</span>
                                    <span>•</span>
                                    <span>{dividend.type.toUpperCase()}</span>
                                    <span>•</span>
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: user?.color }} />
                                    <span>{user?.name.split(' ')[0]}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-amber-600">{formatCurrency(dividend.totalAmount)}</p>
                                <p className="text-xs text-slate-500">{format(new Date(dividend.paymentDate), 'dd/MM/yyyy')}</p>
                              </div>
                            </div>
                          )
                        })}
                      {dividends.length === 0 && (
                        <div className="text-center py-6 text-slate-500">
                          Nenhum dividendo registrado
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Goals Tab */}
            {activeTab === 'goals' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Metas Financeiras</h2>
                    <p className="text-slate-500">Acompanhem os objetivos do casal</p>
                  </div>
                  
                  <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-rose-500 hover:bg-rose-600 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Meta
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Nova Meta</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <Input
                          placeholder="Nome da meta"
                          value={newGoal.name}
                          onChange={e => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <Input
                          placeholder="Descrição (opcional)"
                          value={newGoal.description}
                          onChange={e => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                        />
                        <Input
                          type="number"
                          placeholder="Valor da meta (R$)"
                          value={newGoal.targetAmount}
                          onChange={e => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                        />
                        <Input
                          type="date"
                          placeholder="Data objetivo"
                          value={newGoal.targetDate}
                          onChange={e => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsGoalDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddGoal} className="bg-rose-500 hover:bg-rose-600">
                          Criar Meta
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {goals.map(goal => {
                    const Icon = getCategoryIcon(goal.icon)
                    const progress = (goal.currentAmount / goal.targetAmount) * 100
                    
                    return (
                      <Card key={goal.id} className={`relative overflow-hidden ${goal.status === 'completed' ? 'border-green-300 dark:border-green-700' : ''}`}>
                        {goal.status === 'completed' && (
                          <div className="absolute top-3 right-3">
                            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Concluída
                            </div>
                          </div>
                        )}
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-3">
                            <div 
                              className="p-3 rounded-xl"
                              style={{ backgroundColor: `${goal.color}20` }}
                            >
                              <Icon className="w-6 h-6" style={{ color: goal.color }} />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{goal.name}</CardTitle>
                              {goal.description && (
                                <CardDescription>{goal.description}</CardDescription>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500">Progresso</span>
                              <span className="font-medium">{progress.toFixed(0)}%</span>
                            </div>
                            <Progress value={progress} className="h-3" />
                          </div>
                          
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-2xl font-bold" style={{ color: goal.color }}>
                                {formatCurrency(goal.currentAmount)}
                              </p>
                              <p className="text-sm text-slate-500">
                                de {formatCurrency(goal.targetAmount)}
                              </p>
                            </div>
                            {goal.targetDate && (
                              <p className="text-sm text-slate-500">
                                {format(new Date(goal.targetDate), "MMM/yyyy", { locale: ptBR })}
                              </p>
                            )}
                          </div>
                          
                          {goal.status === 'active' && (
                            <div className="flex gap-2 pt-2">
                              <Input
                                type="number"
                                placeholder="Adicionar valor"
                                className="flex-1"
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    const value = parseFloat((e.target as HTMLInputElement).value)
                                    if (value > 0) {
                                      handleUpdateGoalAmount(goal.id, value)
                                      ;(e.target as HTMLInputElement).value = ''
                                    }
                                  }
                                }}
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={(e) => {
                                  const input = e.currentTarget.previousElementSibling as HTMLInputElement
                                  const value = parseFloat(input.value)
                                  if (value > 0) {
                                    handleUpdateGoalAmount(goal.id, value)
                                    input.value = ''
                                  }
                                }}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => handleDeleteGoal(goal.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Receitas vs Despesas (Últimos 6 meses)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                          <XAxis dataKey="name" className="text-slate-500" />
                          <YAxis className="text-slate-500" tickFormatter={value => `R$${(value/1000).toFixed(0)}k`} />
                          <Tooltip 
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{ 
                              backgroundColor: 'rgba(255,255,255,0.95)',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend />
                          <Bar dataKey="Receitas" fill="#22c55e" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Despesas" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Category breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Gastos por Categoria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {expensesByCategory
                        .sort((a, b) => b.value - a.value)
                        .map(cat => {
                          const percentage = (cat.value / totalExpenses) * 100
                          return (
                            <div key={cat.name} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: cat.color }}
                                  />
                                  <span className="font-medium">{cat.name}</span>
                                </div>
                                <div className="text-right">
                                  <span className="font-bold">{formatCurrency(cat.value)}</span>
                                  <span className="text-slate-500 text-sm ml-2">({percentage.toFixed(1)}%)</span>
                                </div>
                              </div>
                              <Progress 
                                value={percentage} 
                                className="h-2"
                              />
                            </div>
                          )
                        })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
