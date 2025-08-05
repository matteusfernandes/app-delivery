import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface Props {
  params: Promise<{
    id: string
  }>
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
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

    const body = await request.json()
    const { available, name, price, description, category, urlImage } = body

    // Buscar produto
    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    // Preparar dados para atualização (apenas campos fornecidos)
    const updateData: any = {}
    if (available !== undefined) updateData.available = available
    if (name !== undefined) updateData.name = name
    if (price !== undefined) updateData.price = price
    if (description !== undefined) updateData.description = description
    if (category !== undefined) updateData.category = category
    if (urlImage !== undefined) updateData.urlImage = urlImage

    // Atualizar produto
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: {
            orderItems: true
          }
        }
      }
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
