'use client'

import { useSession } from 'next-auth/react'
import { useQuery } from 'react-query'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Clock, CheckCircle, Truck, Package } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface OrderItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    urlImage: string
  }
}

interface Order {
  id: string
  totalPrice: number
  deliveryAddress: string
  deliveryNumber: string
  status: string
  saleDate: string
  orderItems: OrderItem[]
}

const getStatusInfo = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
    case 'pendente':
      return {
        label: 'Pendente',
        color: 'bg-yellow-500',
        textColor: 'text-yellow-700',
        bgColor: 'bg-yellow-50',
        icon: Clock
      }
    case 'preparing':
    case 'preparando':
      return {
        label: 'Preparando',
        color: 'bg-blue-500',
        textColor: 'text-blue-700',
        bgColor: 'bg-blue-50',
        icon: Package
      }
    case 'dispatched':
    case 'em trânsito':
      return {
        label: 'Em Trânsito',
        color: 'bg-purple-500',
        textColor: 'text-purple-700',
        bgColor: 'bg-purple-50',
        icon: Truck
      }
    case 'delivered':
    case 'entregue':
      return {
        label: 'Entregue',
        color: 'bg-green-500',
        textColor: 'text-green-700',
        bgColor: 'bg-green-50',
        icon: CheckCircle
      }
    default:
      return {
        label: status,
        color: 'bg-gray-500',
        textColor: 'text-gray-700',
        bgColor: 'bg-gray-50',
        icon: Clock
      }
  }
}

export default function PedidosPage() {
  const { data: session } = useSession()
  const router = useRouter()

  const { data: orders, isLoading, error } = useQuery<Order[]>(
    ['orders', session?.user?.id],
    async () => {
      if (!session?.user?.id) throw new Error('Usuário não autenticado')
      
      const response = await fetch('/api/orders')
      if (!response.ok) {
        throw new Error('Erro ao carregar pedidos')
      }
      return response.json()
    },
    {
      enabled: !!session?.user?.id,
    }
  )

  if (!session) {
    router.push('/login')
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Erro ao Carregar Pedidos</h1>
          <p className="text-red-600 mb-4">Não foi possível carregar seus pedidos.</p>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary-800 mb-2">
              Meus Pedidos
            </h1>
            <p className="text-primary-600">
              Acompanhe o status de todos os seus pedidos
            </p>
          </div>

          {!orders || orders.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="space-y-4">
                  <Package className="w-16 h-16 mx-auto text-gray-400" />
                  <h2 className="text-2xl font-bold text-gray-700">
                    Nenhum pedido encontrado
                  </h2>
                  <p className="text-gray-500 mb-6">
                    Você ainda não fez nenhum pedido. Que tal fazer o primeiro?
                  </p>
                  <Button
                    onClick={() => router.push('/produtos')}
                    className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
                  >
                    Ver Produtos
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const statusInfo = getStatusInfo(order.status)
                const StatusIcon = statusInfo.icon
                
                return (
                  <Card key={order.id} className="bg-white shadow-lg border-primary-200 hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-primary-800 mb-1">
                            Pedido #{order.id.slice(-8).toUpperCase()}
                          </CardTitle>
                          <CardDescription>
                            {format(new Date(order.saleDate), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                              locale: ptBR,
                            })}
                          </CardDescription>
                        </div>
                        
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusInfo.bgColor}`}>
                          <StatusIcon className={`w-4 h-4 ${statusInfo.textColor}`} />
                          <span className={`font-semibold ${statusInfo.textColor}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        {/* Itens do pedido */}
                        <div>
                          <h4 className="font-semibold text-primary-800 mb-2">Itens:</h4>
                          <div className="space-y-2">
                            {order.orderItems.map((item) => (
                              <div key={item.id} className="flex justify-between items-center text-sm">
                                <span className="text-gray-700">
                                  {item.quantity}x {item.product.name}
                                </span>
                                <span className="text-primary-600 font-semibold">
                                  R$ {(item.product.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Endereço de entrega */}
                        <div>
                          <h4 className="font-semibold text-primary-800 mb-1">Endereço de Entrega:</h4>
                          <p className="text-gray-700 text-sm">
                            {order.deliveryAddress}, {order.deliveryNumber}
                          </p>
                        </div>
                        
                        {/* Total e ações */}
                        <div className="flex justify-between items-center pt-4 border-t border-primary-100">
                          <div>
                            <span className="text-lg font-bold text-primary-800">
                              Total: R$ {order.totalPrice.toFixed(2)}
                            </span>
                          </div>
                          
                          <Button
                            variant="outline"
                            onClick={() => router.push(`/pedidos/${order.id}`)}
                            className="border-primary-300 text-primary-600 hover:bg-primary-50"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
