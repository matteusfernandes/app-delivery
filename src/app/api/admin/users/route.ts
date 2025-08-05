import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Verificar se é administrador
    if (session.user.role !== 'ADMINISTRATOR') {
      return NextResponse.json(
        { error: 'Acesso negado - apenas administradores' },
        { status: 403 }
      )
    }

    // Buscar todos os usuários
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: [
        { role: 'asc' },
        { name: 'asc' }
      ]
    })

    // Buscar contadores separadamente para cada usuário
    const usersWithCounts = await Promise.all(
      users.map(async (user) => {
        const [orderCount, sellerOrderCount] = await Promise.all([
          prisma.order.count({ where: { userId: user.id } }),
          // Usar any temporariamente para sellerId até Prisma ser regenerado
          prisma.order.count({ where: { sellerId: user.id } as any })
        ])
        
        return {
          ...user,
          _count: {
            orders: orderCount,
            sellerOrders: sellerOrderCount
          }
        }
      })
    )

    return NextResponse.json(usersWithCounts)
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
