import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { OrderStatus, PaymentStatus } from '@prisma/client'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { sellerId, deliveryAddress, deliveryNumber, totalPrice, status, products } = body

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: 'Produtos do pedido são obrigatórios' },
        { status: 400 }
      )
    }

    if (!deliveryAddress || !deliveryNumber) {
      return NextResponse.json(
        { error: 'Endereço de entrega é obrigatório' },
        { status: 400 }
      )
    }

    if (!sellerId) {
      return NextResponse.json(
        { error: 'Vendedor é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o vendedor existe
    const seller = await prisma.user.findUnique({
      where: { id: sellerId },
    })

    if (!seller || (seller.role !== 'SELLER' && seller.role !== 'ADMINISTRATOR')) {
      return NextResponse.json(
        { error: 'Vendedor inválido' },
        { status: 400 }
      )
    }

    // Verificar produtos e calcular preço
    let calculatedTotal = 0
    const orderItems = []

    for (const item of products) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })

      if (!product) {
        return NextResponse.json(
          { error: `Produto ${item.productId} não encontrado` },
          { status: 400 }
        )
      }

      if (!product.available) {
        return NextResponse.json(
          { error: `Produto ${product.name} não está disponível` },
          { status: 400 }
        )
      }

      const itemTotal = product.price * item.quantity
      calculatedTotal += itemTotal

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
      })
    }

    // Criar pedido
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        sellerId,
        totalPrice: calculatedTotal,
        deliveryAddress,
        deliveryNumber,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        seller: true,
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
