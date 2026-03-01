import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { compare } from 'bcryptjs'

// Login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Preencha todos os campos' }, { status: 400 })
    }

    
    // Find user
    const user = await db.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'Email não cadastrado' }, { status: 401 })
    }

    
    // Verify password
    const isValid = await compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
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
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Erro ao fazer login' }, { status: 500 })
  }
}
