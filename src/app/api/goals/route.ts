import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET - Listar todas as metas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const coupleId = searchParams.get('coupleId')
    
    if (!coupleId) {
      return NextResponse.json({ error: 'coupleId é obrigatório' }, { status: 400 })
    }
    
    const goals = await db.goal.findMany({
      where: { coupleId },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(goals)
  } catch (error) {
    console.error('Erro ao buscar metas:', error)
    return NextResponse.json({ error: 'Erro ao buscar metas' }, { status: 500 })
  }
}

// POST - Criar nova meta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, targetAmount, currentAmount, targetDate, icon, color, coupleId } = body
    
    if (!name || !targetAmount || !coupleId) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }
    
    const goal = await db.goal.create({
      data: {
        name,
        description,
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount) || 0,
        targetDate: targetDate ? new Date(targetDate) : null,
        icon: icon || 'Target',
        color: color || '#22c55e',
        status: 'active',
        coupleId,
      }
    })
    
    return NextResponse.json(goal)
  } catch (error) {
    console.error('Erro ao criar meta:', error)
    return NextResponse.json({ error: 'Erro ao criar meta' }, { status: 500 })
  }
}

// PUT - Atualizar meta
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, currentAmount, status } = body
    
    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }
    
    const updateData: any = {}
    if (currentAmount !== undefined) updateData.currentAmount = currentAmount
    if (status) updateData.status = status
    
    const goal = await db.goal.update({
      where: { id },
      data: updateData
    })
    
    return NextResponse.json(goal)
  } catch (error) {
    console.error('Erro ao atualizar meta:', error)
    return NextResponse.json({ error: 'Erro ao atualizar meta' }, { status: 500 })
  }
}

// DELETE - Deletar meta
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }
    
    await db.goal.delete({ where: { id } })
    
    return NextResponse.json({ message: 'Meta deletada com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar meta:', error)
    return NextResponse.json({ error: 'Erro ao deletar meta' }, { status: 500 })
  }
}
