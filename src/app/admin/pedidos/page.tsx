'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useQuery } from 'react-query'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  ArrowLeft,
  ShoppingCart, 
  Search,
  Eye,
  Calendar,
  User,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Order {
  id: string
  totalPrice: number
  status: string
  saleDate: string
  user: {
    name: string
    email: string
  }
  seller: {
    name: string
  } | null
  _count: {
    orderItems: number
  }
}

const getStatusInfo = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' }
    case 'preparing':
      return { label: 'Preparando', color: 'bg-blue-100 text-blue-800' }
    case 'dispatched':
      return { label: 'Em Trânsito', color: 'bg-purple-100 text-purple-800' }
    case 'delivered':
      return { label: 'Entregue', color: 'bg-green-100 text-green-800' }
    case 'cancelled':
      return { label: 'Cancelado', color: 'bg-red-100 text-red-800' }
    default:
      return { label: status, color: 'bg-gray-100 text-gray-800' }
  }
}

export default function AdminPedidos() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

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

  const { data: orders, isLoading } = useQuery<Order[]>(
    'admin-orders',
    async () => {
      const response = await fetch('/api/admin/orders')
      if (!response.ok) {
        throw new Error('Erro ao carregar pedidos')
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

  // Filtrar pedidos
  const filteredOrders = orders?.filter(order => {
    const matchesSearch = order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  }) || []

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
                Gerenciar Pedidos
              </h1>
              <p className="text-primary-600">
                Visualize e acompanhe todos os pedidos do sistema
              </p>
            </div>
          </div>

          {/* Filters */}
          <Card className="bg-white shadow-lg border-primary-200 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar por cliente, email ou ID do pedido..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos os Status</SelectItem>
                    <SelectItem value="PENDING">Pendente</SelectItem>
                    <SelectItem value="PREPARING">Preparando</SelectItem>
                    <SelectItem value="DISPATCHED">Em Trânsito</SelectItem>
                    <SelectItem value="DELIVERED">Entregue</SelectItem>
                    <SelectItem value="CANCELLED">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          <Card className="bg-white shadow-lg border-primary-200">
            <CardHeader>
              <CardTitle className="text-primary-800 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Pedidos ({filteredOrders.length})
              </CardTitle>
              <CardDescription>
                Lista de todos os pedidos realizados no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : filteredOrders.length > 0 ? (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const statusInfo = getStatusInfo(order.status)
                    
                    return (
                      <div key={order.id} className="flex items-center justify-between p-4 border border-primary-100 rounded-lg hover:bg-primary-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <ShoppingCart className="w-10 h-10 text-primary-600 bg-primary-100 rounded-full p-2" />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-primary-800">
                                Pedido #{order.id.slice(-8).toUpperCase()}
                              </h3>
                              <Badge className={statusInfo.color}>
                                {statusInfo.label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span>{order.user.name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {format(new Date(order.saleDate), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                                </span>
                              </div>
                              {order.seller && (
                                <div className="flex items-center gap-1">
                                  <span>Vendedor: {order.seller.name}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-lg font-bold text-primary-800">
                              <DollarSign className="w-4 h-4" />
                              <span>R$ {order.totalPrice.toFixed(2)}</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {order._count.orderItems} {order._count.orderItems === 1 ? 'item' : 'itens'}
                            </p>
                          </div>
                          
                          <Link href={`/pedidos/${order.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalhes
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Nenhum pedido encontrado
                  </h3>
                  <p className="text-gray-500">
                    Tente ajustar os filtros de pesquisa
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
