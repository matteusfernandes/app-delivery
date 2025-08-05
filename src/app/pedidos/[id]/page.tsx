'use client'

import { useSession } from 'next-auth/react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock, CheckCircle, Truck, Package, User } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'

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

interface Seller {
  id: string
  name: string
  email: string
}

interface Order {
  id: string
  totalPrice: number
  deliveryAddress: string
  deliveryNumber: string
  status: string
  saleDate: string
  orderItems: OrderItem[]
  seller?: Seller
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
        icon: Clock,
        description: 'Seu pedido foi recebido e está aguardando processamento'
      }
    case 'preparing':
    case 'preparando':
      return {
        label: 'Preparando',
        color: 'bg-blue-500',
        textColor: 'text-blue-700',
        bgColor: 'bg-blue-50',
        icon: Package,
        description: 'Seu pedido está sendo preparado'
      }
    case 'dispatched':
    case 'em trânsito':
      return {
        label: 'Em Trânsito',
        color: 'bg-purple-500',
        textColor: 'text-purple-700',
        bgColor: 'bg-purple-50',
        icon: Truck,
        description: 'Seu pedido saiu para entrega'
      }
    case 'delivered':
    case 'entregue':
      return {
        label: 'Entregue',
        color: 'bg-green-500',
        textColor: 'text-green-700',
        bgColor: 'bg-green-50',
        icon: CheckCircle,
        description: 'Seu pedido foi entregue com sucesso'
      }
    default:
      return {
        label: status,
        color: 'bg-gray-500',
        textColor: 'text-gray-700',
        bgColor: 'bg-gray-50',
        icon: Clock,
        description: 'Status do pedido'
      }
  }
}

interface Props {
  params: {
    id: string
  }
}

export default function PedidoDetalhesPage({ params }: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: order, isLoading, error } = useQuery<Order>(
    ['order', params.id],
    async () => {
      const response = await fetch(`/api/orders/${params.id}`)
      if (!response.ok) {
        throw new Error('Erro ao carregar pedido')
      }
      return response.json()
    },
    {
      enabled: !!session?.user?.id,
    }
  )

  const updateStatusMutation = useMutation(
    async (newStatus: string) => {
      const response = await fetch(`/api/orders/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (!response.ok) {
        throw new Error('Erro ao atualizar status')
      }
      
      return response.json()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['order', params.id])
        queryClient.invalidateQueries(['orders'])
        toast({
          title: 'Status atualizado',
          description: 'O status do pedido foi atualizado com sucesso',
        })
      },
      onError: () => {
        toast({
          title: 'Erro ao atualizar',
          description: 'Não foi possível atualizar o status do pedido',
          variant: 'destructive',
        })
      },
    }
  )

  const handleStatusUpdate = (newStatus: string) => {
    updateStatusMutation.mutate(newStatus)
  }

  if (!session) {
    router.push('/login')
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <Card>
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-20 bg-gray-200 rounded"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Pedido não encontrado</h1>
          <p className="text-red-600 mb-4">Não foi possível carregar os detalhes do pedido.</p>
          <Button onClick={() => router.push('/pedidos')}>
            Voltar aos Pedidos
          </Button>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(order.status)
  const StatusIcon = statusInfo.icon
  const isCustomer = session.user.role === 'CUSTOMER'
  const isSeller = session.user.role === 'SELLER' || session.user.role === 'ADMINISTRATOR'

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Cabeçalho */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="border-primary-300 text-primary-600 hover:bg-primary-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            
            <div>
              <h1 className="text-4xl font-bold text-primary-800">
                Pedido #{order.id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-primary-600">
                {format(new Date(order.saleDate), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Informações principais */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status */}
              <Card className="bg-white shadow-lg border-primary-200">
                <CardHeader>
                  <CardTitle className="text-primary-800">Status do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`flex items-center gap-4 p-4 rounded-lg ${statusInfo.bgColor}`}>
                    <StatusIcon className={`w-8 h-8 ${statusInfo.textColor}`} />
                    <div>
                      <h3 className={`text-xl font-bold ${statusInfo.textColor}`}>
                        {statusInfo.label}
                      </h3>
                      <p className={`text-sm ${statusInfo.textColor} opacity-80`}>
                        {statusInfo.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Botões de ação para cliente */}
                  {isCustomer && order.status.toLowerCase() === 'dispatched' && (
                    <div className="mt-4">
                      <Button
                        onClick={() => handleStatusUpdate('DELIVERED')}
                        disabled={updateStatusMutation.isLoading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Marcar como Entregue
                      </Button>
                    </div>
                  )}
                  
                  {/* Botões de ação para vendedor */}
                  {isSeller && (
                    <div className="mt-4 flex gap-2 flex-wrap">
                      {order.status.toLowerCase() === 'pending' && (
                        <Button
                          onClick={() => handleStatusUpdate('PREPARING')}
                          disabled={updateStatusMutation.isLoading}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Package className="w-4 h-4 mr-2" />
                          Preparar Pedido
                        </Button>
                      )}
                      
                      {order.status.toLowerCase() === 'preparing' && (
                        <Button
                          onClick={() => handleStatusUpdate('DISPATCHED')}
                          disabled={updateStatusMutation.isLoading}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Truck className="w-4 h-4 mr-2" />
                          Saiu para Entrega
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Itens do pedido */}
              <Card className="bg-white shadow-lg border-primary-200">
                <CardHeader>
                  <CardTitle className="text-primary-800">Itens do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border border-primary-100 rounded-lg">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden">
                          <Image
                            src={item.product.urlImage}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-primary-800">{item.product.name}</h3>
                          <p className="text-primary-600">R$ {item.product.price.toFixed(2)} cada</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                          <p className="font-bold text-primary-800">
                            R$ {(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar com informações adicionais */}
            <div className="space-y-6">
              {/* Resumo financeiro */}
              <Card className="bg-white shadow-lg border-primary-200">
                <CardHeader>
                  <CardTitle className="text-primary-800">Resumo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>R$ {order.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taxa de entrega:</span>
                      <span className="text-green-600">Grátis</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span className="text-primary-800">Total:</span>
                        <span className="text-primary-800">R$ {order.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Endereço de entrega */}
              <Card className="bg-white shadow-lg border-primary-200">
                <CardHeader>
                  <CardTitle className="text-primary-800">Endereço de Entrega</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    {order.deliveryAddress}, {order.deliveryNumber}
                  </p>
                </CardContent>
              </Card>

              {/* Vendedor responsável */}
              {order.seller && (
                <Card className="bg-white shadow-lg border-primary-200">
                  <CardHeader>
                    <CardTitle className="text-primary-800">Vendedor Responsável</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <User className="w-8 h-8 text-primary-600 bg-primary-100 rounded-full p-1" />
                      <div>
                        <p className="font-semibold text-primary-800">{order.seller.name}</p>
                        <p className="text-sm text-gray-600">{order.seller.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
