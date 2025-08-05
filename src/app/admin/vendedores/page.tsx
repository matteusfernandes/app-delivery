'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useQuery } from 'react-query'
import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Store, 
  TrendingUp,
  ShoppingCart,
  Crown,
  User
} from 'lucide-react'
import Link from 'next/link'

interface Seller {
  id: string
  name: string
  email: string
  role: 'SELLER' | 'ADMINISTRATOR'
  createdAt: string
  stats: {
    totalOrders: number
    totalRevenue: number
    avgOrderValue: number
    pendingOrders: number
  }
}

export default function AdminVendedores() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Verificar autenticação e permissão
  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/login')
      return
    }
    
    if (session.user.role !== 'ADMINISTRATOR') {
      router.push('/')
      return
    }
  }, [session, status, router])

  const { data: sellers, isLoading } = useQuery<Seller[]>(
    'admin-sellers',
    async () => {
      const response = await fetch('/api/admin/sellers')
      if (!response.ok) {
        throw new Error('Erro ao carregar vendedores')
      }
      return response.json()
    },
    {
      enabled: !!session && session.user.role === 'ADMINISTRATOR',
    }
  )

  if (status === 'loading' || !session || session.user.role !== 'ADMINISTRATOR') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-primary-800">Carregando...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/admin">
              <Button variant="outline" className="border-primary-300 text-primary-600 hover:bg-primary-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Dashboard
              </Button>
            </Link>
            
            <div>
              <h1 className="text-4xl font-bold text-primary-800">
                Gerenciar Vendedores
              </h1>
              <p className="text-primary-600">
                Performance e estatísticas dos vendedores
              </p>
            </div>
          </div>

          {/* Sellers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="bg-white shadow-lg border-primary-200">
                  <div className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="h-8 bg-gray-200 rounded"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))
            ) : sellers && sellers.length > 0 ? (
              sellers.map((seller) => {
                const isAdmin = seller.role === 'ADMINISTRATOR'
                
                return (
                  <Card key={seller.id} className="bg-white shadow-lg border-primary-200 hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isAdmin ? (
                            <Crown className="w-10 h-10 text-red-600 bg-red-100 rounded-full p-2" />
                          ) : (
                            <Store className="w-10 h-10 text-primary-600 bg-primary-100 rounded-full p-2" />
                          )}
                          <div>
                            <CardTitle className="text-primary-800">{seller.name}</CardTitle>
                            <CardDescription>{seller.email}</CardDescription>
                          </div>
                        </div>
                        <Badge variant={isAdmin ? 'destructive' : 'default'}>
                          {isAdmin ? 'Admin' : 'Vendedor'}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-primary-50 rounded-lg">
                          <ShoppingCart className="w-6 h-6 text-primary-600 mx-auto mb-1" />
                          <p className="text-2xl font-bold text-primary-800">
                            {seller.stats.totalOrders}
                          </p>
                          <p className="text-sm text-gray-600">Total de Vendas</p>
                        </div>
                        
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-1" />
                          <p className="text-2xl font-bold text-green-800">
                            R$ {seller.stats.totalRevenue.toFixed(0)}
                          </p>
                          <p className="text-sm text-gray-600">Receita Total</p>
                        </div>
                        
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="w-6 h-6 bg-blue-600 rounded-full mx-auto mb-1 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">R$</span>
                          </div>
                          <p className="text-lg font-bold text-blue-800">
                            R$ {seller.stats.avgOrderValue.toFixed(0)}
                          </p>
                          <p className="text-sm text-gray-600">Ticket Médio</p>
                        </div>
                        
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                          <div className="w-6 h-6 bg-yellow-600 rounded-full mx-auto mb-1 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">!</span>
                          </div>
                          <p className="text-lg font-bold text-yellow-800">
                            {seller.stats.pendingOrders}
                          </p>
                          <p className="text-sm text-gray-600">Pendentes</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          Membro desde {new Date(seller.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Nenhum vendedor encontrado
                </h3>
                <p className="text-gray-500">
                  Não há vendedores cadastrados no sistema
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
