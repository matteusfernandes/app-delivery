import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { OrderStatus } from '@prisma/client'

interface Props {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const order = await prisma.order.findUnique({
      where: {
        id: params.id,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o usuário tem permissão para ver este pedido
    const canView = 
      order.userId === session.user.id || // É o dono do pedido
      session.user.role === 'SELLER' || // É vendedor
      session.user.role === 'ADMINISTRATOR' // É admin

    if (!canView) {
      return NextResponse.json(
        { error: 'Não autorizado a ver este pedido' },
        { status: 403 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Erro ao buscar pedido:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o status é válido
    const validStatuses = Object.values(OrderStatus)
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Status inválido' },
        { status: 400 }
      )
    }

    // Buscar o pedido primeiro
    const order = await prisma.order.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      )
    }

    // Verificar permissões para atualização
    const canUpdate = 
      (order.userId === session.user.id && status === 'DELIVERED') || // Cliente só pode marcar como entregue
      session.user.role === 'SELLER' || // Vendedor pode alterar status
      session.user.role === 'ADMINISTRATOR' // Admin pode alterar qualquer status

    if (!canUpdate) {
      return NextResponse.json(
        { error: 'Não autorizado a atualizar este pedido' },
        { status: 403 }
      )
    }

    // Atualizar o pedido
    const updatedOrder = await prisma.order.update({
      where: {
        id: params.id,
      },
      data: {
        status,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
