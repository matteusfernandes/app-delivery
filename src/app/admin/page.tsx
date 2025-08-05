'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useQuery } from 'react-query'
import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Eye,
  Settings,
  UserCheck,
  Store
} from 'lucide-react'
import Link from 'next/link'

interface AdminStats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
  recentOrders: Array<{
    id: string
    user: { name: string }
    totalPrice: number
    status: string
    saleDate: string
  }>
}

export default function AdminDashboard() {
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

  const { data: stats, isLoading } = useQuery<AdminStats>(
    'admin-stats',
    async () => {
      const response = await fetch('/api/admin/stats')
      if (!response.ok) {
        throw new Error('Erro ao carregar estatísticas')
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-12 bg-gray-200 rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary-800 mb-2">
              Dashboard Administrativo
            </h1>
            <p className="text-primary-600">
              Bem-vindo, {session.user.name}! Gerencie todo o sistema a partir daqui.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white shadow-lg border-primary-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                    <p className="text-3xl font-bold text-primary-800">
                      {stats?.totalUsers || 0}
                    </p>
                  </div>
                  <Users className="w-12 h-12 text-primary-600 bg-primary-100 rounded-full p-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-primary-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
                    <p className="text-3xl font-bold text-primary-800">
                      {stats?.totalProducts || 0}
                    </p>
                  </div>
                  <Package className="w-12 h-12 text-blue-600 bg-blue-100 rounded-full p-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-primary-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                    <p className="text-3xl font-bold text-primary-800">
                      {stats?.totalOrders || 0}
                    </p>
                    <p className="text-sm text-orange-600">
                      {stats?.pendingOrders || 0} pendentes
                    </p>
                  </div>
                  <ShoppingCart className="w-12 h-12 text-green-600 bg-green-100 rounded-full p-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-primary-200 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Receita Total</p>
                    <p className="text-3xl font-bold text-primary-800">
                      R$ {stats?.totalRevenue?.toFixed(2) || '0,00'}
                    </p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-purple-600 bg-purple-100 rounded-full p-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Management Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link href="/admin/usuarios">
              <Card className="bg-white shadow-lg border-primary-200 hover:shadow-xl transition-all cursor-pointer hover:scale-105">
                <CardContent className="p-6 text-center">
                  <Users className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-primary-800 mb-2">
                    Gerenciar Usuários
                  </h3>
                  <p className="text-sm text-gray-600">
                    Visualizar, editar e gerenciar usuários do sistema
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/produtos">
              <Card className="bg-white shadow-lg border-primary-200 hover:shadow-xl transition-all cursor-pointer hover:scale-105">
                <CardContent className="p-6 text-center">
                  <Package className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-primary-800 mb-2">
                    Gerenciar Produtos
                  </h3>
                  <p className="text-sm text-gray-600">
                    Adicionar, editar e remover produtos do catálogo
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/pedidos">
              <Card className="bg-white shadow-lg border-primary-200 hover:shadow-xl transition-all cursor-pointer hover:scale-105">
                <CardContent className="p-6 text-center">
                  <ShoppingCart className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-primary-800 mb-2">
                    Gerenciar Pedidos
                  </h3>
                  <p className="text-sm text-gray-600">
                    Visualizar e gerenciar todos os pedidos do sistema
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/vendedores">
              <Card className="bg-white shadow-lg border-primary-200 hover:shadow-xl transition-all cursor-pointer hover:scale-105">
                <CardContent className="p-6 text-center">
                  <Store className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-primary-800 mb-2">
                    Gerenciar Vendedores
                  </h3>
                  <p className="text-sm text-gray-600">
                    Visualizar performance e gerenciar vendedores
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Recent Orders */}
          <Card className="bg-white shadow-lg border-primary-200">
            <CardHeader>
              <CardTitle className="text-primary-800">Pedidos Recentes</CardTitle>
              <CardDescription>
                Últimos pedidos realizados no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-primary-100 rounded-lg">
                      <div className="flex items-center gap-4">
                        <ShoppingCart className="w-8 h-8 text-primary-600" />
                        <div>
                          <p className="font-semibold text-primary-800">
                            Pedido #{order.id.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-600">
                            Cliente: {order.user.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.saleDate).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-800">
                          R$ {order.totalPrice.toFixed(2)}
                        </p>
                        <Badge variant={order.status === 'PENDING' ? 'secondary' : 'default'}>
                          {order.status}
                        </Badge>
                      </div>
                      <Link href={`/pedidos/${order.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Nenhum pedido encontrado
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
