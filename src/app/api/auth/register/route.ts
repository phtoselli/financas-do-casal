import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { addMonths } from 'date-fns'

// Register new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, inviteToken } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Preencha todos os campos' }, { status: 400 })
    }

    
    // Check if email exists
    const existingUser = await db.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Este email já está cadastrado' }, { status: 400 })
    }
    
    // Hash password
    const hashedPassword = await hash(password, 10)
    
    let coupleId: string | null = null
    
    // If there's an invite token
    if (inviteToken) {
      const invite = await db.invite.findUnique({
        where: { token: inviteToken },
        include: { couple: true }
      })
      
      if (!invite) {
        return NextResponse.json({ error: 'Convite inválido' }, { status: 400 })
      }
      
      if (invite.status !== 'pending') {
        return NextResponse.json({ error: 'Este convite já foi usado' }, { status: 400 })
      }
      
      if (new Date(invite.expiresAt) < new Date()) {
        return NextResponse.json({ error: 'Convite expirado' }, { status: 400 })
      }
      
      coupleId = invite.coupleId
    } else {
      // Create new couple with default name
      const couple = await db.couple.create({
        data: { name: `Família de ${name}` }
      })
      coupleId = couple.id
    }
    
    // Determine user color
    const colors = ['#ec4899', '#3b82f6', '#22c55e', '#f97316', '#8b5cf6', '#06b6d4', '#0ea5e9']
    const existingMembers = await db.user.count({ where: { coupleId } })
    const color = colors[existingMembers % colors.length]
    
    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        color,
        coupleId
      },
      include: { couple: true }
    })
    
    // If it was an invite, update the invite with the user who accepted
    if (inviteToken) {
      await db.invite.update({
        where: { id: invite.id },
        data: { 
          status: 'accepted',
          acceptedById: user.id 
        }
      })
    }
    
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        color: user.color,
        coupleId: user.coupleId
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Erro ao criar conta' }, { status: 500 })
  }
}
