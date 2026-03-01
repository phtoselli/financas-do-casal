import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { addMonths } from 'date-fns'

// Create invite
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { coupleId, inviterId } = body
    
    if (!coupleId || !inviterId) {
      return NextResponse.json({ error: 'coupleId e inviterId são obrigatórios' }, { status: 400 })
    }
    
    // Get couple
    const couple = await db.couple.findUnique({
      where: { id: coupleId },
      include: { members: true }
    })
    
    if (!couple) {
      return NextResponse.json({ error: 'Casal não encontrado' }, { status: 404 })
    }
    
    // Check if already has 2 members
    if (couple.members.length >= 2) {
      return NextResponse.json({ error: 'Este casal já está completo' }, { status: 400 })
    }
    
    // Check if there's pending invite
    const pendingInvite = await db.invite.findFirst({
      where: { coupleId, status: 'pending' }
    })
    
    if (pendingInvite) {
      // Return existing invite
      return NextResponse.json({ 
        success: true,
        invite: {
          id: pendingInvite.id,
          token: pendingInvite.token,
          expiresAt: pendingInvite.expiresAt
        }
      })
    }
    
    // Generate unique token
    const token = uuidv4()
    const expiresAt = addMonths(new Date(), 1)
    
    // Create invite
    const invite = await db.invite.create({
      data: {
        token,
        coupleId,
        invitedBy: inviterId,
        expiresAt,
        status: 'pending'
      }
    })
    
    return NextResponse.json({ 
      success: true,
      invite: {
        id: invite.id,
        token: invite.token,
        expiresAt: invite.expiresAt
      }
    })
  } catch (error) {
    console.error('Create invite error:', error)
    return NextResponse.json({ error: 'Erro ao criar convite' }, { status: 500 })
  }
}

// Get invite info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    
    if (!token) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 400 })
    }
    
    const invite = await db.invite.findUnique({
      where: { token },
      include: { 
        couple: true,
      }
    })
    
    if (!invite) {
      return NextResponse.json({ error: 'Convite não encontrado' }, { status: 404 })
    }
    
    // Check if expired
    if (new Date(invite.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'Convite expirado' }, { status: 400 })
    }
    
    return NextResponse.json({
      coupleName: invite.couple.name,
    })
  } catch (error) {
    console.error('Get invite info error:', error)
    return NextResponse.json({ error: 'Erro ao buscar convite' }, { status: 500 })
  }
}
