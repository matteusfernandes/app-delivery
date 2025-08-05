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

    // Buscar estatísticas
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
      recentOrders
    ] = await Promise.all([
      // Total de usuários
      prisma.user.count(),
      
      // Total de produtos
      prisma.product.count(),
      
      // Total de pedidos
      prisma.order.count(),
      
      // Pedidos pendentes
      prisma.order.count({
        where: { status: 'PENDING' }
      }),
      
      // Receita total
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: { status: { not: 'CANCELLED' } }
      }),
      
      // Pedidos recentes (últimos 10)
      prisma.order.findMany({
        take: 10,
        orderBy: { saleDate: 'desc' },
        include: {
          user: {
            select: { name: true }
          }
        }
      })
    ])

    const stats = {
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      recentOrders
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erro ao buscar estatísticas administrativas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
