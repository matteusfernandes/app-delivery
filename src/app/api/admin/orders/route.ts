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

    // Buscar todos os pedidos com informações relacionadas
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            orderItems: true
          }
        }
      },
      orderBy: {
        saleDate: 'desc'
      }
    })

    // Buscar informações do vendedor separadamente para cada pedido
    const ordersWithSellers = await Promise.all(
      orders.map(async (order) => {
        let seller = null
        try {
          seller = await prisma.user.findUnique({
            where: { id: (order as any).sellerId },
            select: { name: true }
          })
        } catch (error) {
          console.error('Erro ao buscar vendedor:', error)
        }
        
        return {
          ...order,
          seller
        }
      })
    )

    return NextResponse.json(ordersWithSellers)
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
