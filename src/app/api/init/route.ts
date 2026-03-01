import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// Inicializa o banco com dados demo
export async function GET() {
  try {
    // Verificar se já existe um casal
    const existingCouple = await db.couple.findFirst()
    
    if (existingCouple) {
      return NextResponse.json({ message: 'Banco já inicializado', couple: existingCouple })
    }
    
    // Criar casal
    const couple = await db.couple.create({
      data: {
        name: 'Maria & João',
      }
    })
    
    // Criar usuários
    const user1 = await db.user.create({
      data: {
        name: 'Maria Silva',
        email: 'maria@email.com',
        color: '#ec4899',
        coupleId: couple.id,
      }
    })
    
    const user2 = await db.user.create({
      data: {
        name: 'João Santos',
        email: 'joao@email.com',
        color: '#3b82f6',
        coupleId: couple.id,
      }
    })
    
    // Criar categorias padrão
    const categories = await Promise.all([
      db.category.create({ data: { name: 'Salário', icon: 'Briefcase', color: '#22c55e', type: 'income', coupleId: couple.id } }),
      db.category.create({ data: { name: 'Freelance', icon: 'DollarSign', color: '#10b981', type: 'income', coupleId: couple.id } }),
      db.category.create({ data: { name: 'Investimentos', icon: 'TrendingUp', color: '#14b8a6', type: 'income', coupleId: couple.id } }),
      db.category.create({ data: { name: 'Alimentação', icon: 'Utensils', color: '#f97316', type: 'expense', coupleId: couple.id } }),
      db.category.create({ data: { name: 'Transporte', icon: 'Car', color: '#3b82f6', type: 'expense', coupleId: couple.id } }),
      db.category.create({ data: { name: 'Moradia', icon: 'Building', color: '#8b5cf6', type: 'expense', coupleId: couple.id } }),
      db.category.create({ data: { name: 'Lazer', icon: 'Gamepad2', color: '#ec4899', type: 'expense', coupleId: couple.id } }),
      db.category.create({ data: { name: 'Saúde', icon: 'HeartPulse', color: '#ef4444', type: 'expense', coupleId: couple.id } }),
      db.category.create({ data: { name: 'Educação', icon: 'GraduationCap', color: '#06b6d4', type: 'expense', coupleId: couple.id } }),
      db.category.create({ data: { name: 'Compras', icon: 'ShoppingBag', color: '#a855f7', type: 'expense', coupleId: couple.id } }),
      db.category.create({ data: { name: 'Contas', icon: 'Zap', color: '#eab308', type: 'expense', coupleId: couple.id } }),
      db.category.create({ data: { name: 'Viagem', icon: 'Plane', color: '#0ea5e9', type: 'expense', coupleId: couple.id } }),
      db.category.create({ data: { name: 'Presentes', icon: 'Gift', color: '#f43f5e', type: 'expense', coupleId: couple.id } }),
    ])
    
    // Criar metas iniciais
    const goals = await Promise.all([
      db.goal.create({
        data: {
          name: 'Viagem de Férias',
          description: 'Viagem para Europa',
          targetAmount: 15000,
          currentAmount: 8500,
          targetDate: new Date('2025-12-01'),
          icon: 'Plane',
          color: '#0ea5e9',
          status: 'active',
          coupleId: couple.id,
        }
      }),
      db.goal.create({
        data: {
          name: 'Entrada do Apartamento',
          description: 'Guardar para entrada',
          targetAmount: 50000,
          currentAmount: 25000,
          targetDate: new Date('2026-06-01'),
          icon: 'Building',
          color: '#8b5cf6',
          status: 'active',
          coupleId: couple.id,
        }
      }),
      db.goal.create({
        data: {
          name: 'Fundo de Emergência',
          description: '6 meses de despesas',
          targetAmount: 24000,
          currentAmount: 24000,
          icon: 'Wallet',
          color: '#22c55e',
          status: 'completed',
          coupleId: couple.id,
        }
      }),
    ])
    
    // Criar transações demo
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    const incomeCategory = categories.find(c => c.name === 'Salário')!
    const freelanceCategory = categories.find(c => c.name === 'Freelance')!
    const alimentacaoCategory = categories.find(c => c.name === 'Alimentação')!
    const transporteCategory = categories.find(c => c.name === 'Transporte')!
    const moradiaCategory = categories.find(c => c.name === 'Moradia')!
    const lazerCategory = categories.find(c => c.name === 'Lazer')!
    const saudeCategory = categories.find(c => c.name === 'Saúde')!
    const educacaoCategory = categories.find(c => c.name === 'Educação')!
    const contasCategory = categories.find(c => c.name === 'Contas')!
    const presentesCategory = categories.find(c => c.name === 'Presentes')!
    
    const transactions = await Promise.all([
      // Receitas do mês atual
      db.transaction.create({ data: { description: 'Salário Maria', amount: 7500, type: 'income', date: new Date(currentYear, currentMonth, 5), categoryId: incomeCategory.id, userId: user1.id, coupleId: couple.id } }),
      db.transaction.create({ data: { description: 'Salário João', amount: 6500, type: 'income', date: new Date(currentYear, currentMonth, 5), categoryId: incomeCategory.id, userId: user2.id, coupleId: couple.id } }),
      db.transaction.create({ data: { description: 'Freelance Design', amount: 1200, type: 'income', date: new Date(currentYear, currentMonth, 20), categoryId: freelanceCategory.id, userId: user1.id, coupleId: couple.id } }),
      
      // Despesas do mês atual
      db.transaction.create({ data: { description: 'Aluguel', amount: 2200, type: 'expense', date: new Date(currentYear, currentMonth, 10), categoryId: moradiaCategory.id, userId: user1.id, coupleId: couple.id } }),
      db.transaction.create({ data: { description: 'Supermercado', amount: 850, type: 'expense', date: new Date(currentYear, currentMonth, 12), categoryId: alimentacaoCategory.id, userId: user2.id, coupleId: couple.id } }),
      db.transaction.create({ data: { description: 'Uber mensal', amount: 320, type: 'expense', date: new Date(currentYear, currentMonth, 15), categoryId: transporteCategory.id, userId: user1.id, coupleId: couple.id } }),
      db.transaction.create({ data: { description: 'Netflix + Spotify', amount: 89, type: 'expense', date: new Date(currentYear, currentMonth, 8), categoryId: lazerCategory.id, userId: user2.id, coupleId: couple.id } }),
      db.transaction.create({ data: { description: 'Academia', amount: 150, type: 'expense', date: new Date(currentYear, currentMonth, 5), categoryId: saudeCategory.id, userId: user1.id, coupleId: couple.id } }),
      db.transaction.create({ data: { description: 'Curso Online', amount: 297, type: 'expense', date: new Date(currentYear, currentMonth, 18), categoryId: educacaoCategory.id, userId: user2.id, coupleId: couple.id } }),
      db.transaction.create({ data: { description: 'Luz', amount: 180, type: 'expense', date: new Date(currentYear, currentMonth, 12), categoryId: contasCategory.id, userId: user1.id, coupleId: couple.id } }),
      db.transaction.create({ data: { description: 'Internet', amount: 120, type: 'expense', date: new Date(currentYear, currentMonth, 10), categoryId: contasCategory.id, userId: user2.id, coupleId: couple.id } }),
      db.transaction.create({ data: { description: 'Jantar Romântico', amount: 280, type: 'expense', date: new Date(currentYear, currentMonth, 14), categoryId: alimentacaoCategory.id, userId: user2.id, coupleId: couple.id } }),
      db.transaction.create({ data: { description: 'Presente Aniversário', amount: 350, type: 'expense', date: new Date(currentYear, currentMonth, 22), categoryId: presentesCategory.id, userId: user1.id, coupleId: couple.id } }),
    ])
    
    return NextResponse.json({ 
      message: 'Banco inicializado com sucesso',
      couple,
      users: [user1, user2],
      categories,
      goals,
      transactions
    })
  } catch (error) {
    console.error('Erro ao inicializar banco:', error)
    return NextResponse.json({ error: 'Erro ao inicializar banco' }, { status: 500 })
  }
}
