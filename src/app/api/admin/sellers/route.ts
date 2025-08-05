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

    // Buscar vendedores e administradores
    const sellers = await prisma.user.findMany({
      where: {
        OR: [
          { role: 'SELLER' },
          { role: 'ADMINISTRATOR' }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: [
        { role: 'asc' },
        { name: 'asc' }
      ]
    })

    // Calcular estatísticas para cada vendedor
    const sellersWithStats = await Promise.all(
      sellers.map(async (seller) => {
        const orders = await prisma.order.findMany({
          where: { sellerId: seller.id } as any,
          select: {
            totalPrice: true,
            status: true
          }
        })

        const totalOrders = orders.length
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
        const pendingOrders = orders.filter(order => order.status === 'PENDING').length

        return {
          ...seller,
          stats: {
            totalOrders,
            totalRevenue,
            avgOrderValue,
            pendingOrders
          }
        }
      })
    )

    return NextResponse.json(sellersWithStats)
  } catch (error) {
    console.error('Erro ao buscar vendedores:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
