import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('=== PUBLIC SELLERS API ===')
    
    // Buscar todos os vendedores e administradores SEM autenticação
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
        role: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    console.log('Vendedores encontrados (sem auth):', sellers.length)
    console.log('Lista de vendedores:', sellers)
    console.log('===========================')
    
    return NextResponse.json(sellers)
  } catch (error) {
    console.error('Erro ao buscar vendedores:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
