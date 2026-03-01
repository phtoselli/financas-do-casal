import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET - Listar todas as transações
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const coupleId = searchParams.get('coupleId')
    const month = searchParams.get('month')
    const year = searchParams.get('year')
    
    if (!coupleId) {
      return NextResponse.json({ error: 'coupleId é obrigatório' }, { status: 400 })
    }
    
    const where: any = { coupleId }
    
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
      const endDate = new Date(parseInt(year), parseInt(month), 0)
      where.date = {
        gte: startDate,
        lte: endDate
      }
    }
    
    const transactions = await db.transaction.findMany({
      where,
      include: {
        category: true,
        user: true,
      },
      orderBy: { date: 'desc' }
    })
    
    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Erro ao buscar transações:', error)
    return NextResponse.json({ error: 'Erro ao buscar transações' }, { status: 500 })
  }
}

// POST - Criar nova transação
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { description, amount, type, date, categoryId, userId, coupleId, notes, isRecurring } = body
    
    if (!description || !amount || !type || !categoryId || !userId || !coupleId) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }
    
    const transaction = await db.transaction.create({
      data: {
        description,
        amount: parseFloat(amount),
        type,
        date: new Date(date),
        categoryId,
        userId,
        coupleId,
        notes,
        isRecurring: isRecurring || false,
      },
      include: {
        category: true,
        user: true,
      }
    })
    
    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Erro ao criar transação:', error)
    return NextResponse.json({ error: 'Erro ao criar transação' }, { status: 500 })
  }
}

// DELETE - Deletar transação
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }
    
    await db.transaction.delete({ where: { id } })
    
    return NextResponse.json({ message: 'Transação deletada com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar transação:', error)
    return NextResponse.json({ error: 'Erro ao deletar transação' }, { status: 500 })
  }
}
