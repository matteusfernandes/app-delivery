'use client'

import { use } from 'react'
import { useSession } from 'next-auth/react'
import { useQuery } from 'react-query'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ShoppingBag, Clock, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
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

interface Order {
  id: string
  totalPrice: number
  deliveryAddress: string
  deliveryNumber: string
  status: string
  saleDate: string
  orderItems: OrderItem[]
  seller: {
    id: string
    name: string
    email: string
  }
}

interface Props {
  params: Promise<{
    id: string
  }>
}

export default function ConfirmacaoPedidoPage({ params }: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const { id } = use(params)

  const { data: order, isLoading } = useQuery<Order>(
    ['order', id],
    async () => {
      const response = await fetch(`/api/orders/${id}`)
      if (!response.ok) {
        throw new Error('Erro ao carregar pedido')
      }
      return response.json()
    },
    {
      enabled: !!session?.user?.id,
    }
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-primary-800">Carregando...</h2>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Pedido não encontrado</h2>
            <p className="text-gray-600 mb-4">Não foi possível carregar as informações do pedido.</p>
            <Button onClick={() => router.push('/produtos')} className="w-full">
              Voltar às Compras
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header de Sucesso */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-primary-800 mb-2">
              Pedido Realizado com Sucesso!
            </h1>
            <p className="text-lg text-primary-600">
              Seu pedido #{order?.id?.slice(-8) || 'N/A'} foi confirmado e está sendo processado.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Informações do Pedido */}
            <Card className="bg-white shadow-lg border-primary-200">
              <CardHeader>
                <CardTitle className="text-primary-800 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Detalhes do Pedido
                </CardTitle>
                <CardDescription>
                  Informações sobre seu pedido
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-600">Número do Pedido:</span>
                  <span className="font-semibold">#{order?.id?.slice(-8) || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-600">Data do Pedido:</span>
                  <span className="font-semibold">
                    {order?.saleDate ? format(new Date(order.saleDate), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-600">Status:</span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      {order?.status || 'Pendente'}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-600">Vendedor Responsável:</span>
                  <span className="font-semibold">{order.seller?.name || 'Carregando...'}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Endereço de Entrega:</span>
                  <div className="text-right">
                    <div className="font-semibold">{order?.deliveryAddress || 'N/A'}</div>
                    <div className="text-sm text-gray-600">Nº {order?.deliveryNumber || 'N/A'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Itens do Pedido */}
            <Card className="bg-white shadow-lg border-primary-200">
              <CardHeader>
                <CardTitle className="text-primary-800 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Produtos
                </CardTitle>
                <CardDescription>
                  Itens incluídos no seu pedido
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.orderItems?.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 border border-primary-100 rounded-lg">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden">
                        <Image
                          src={item.product?.urlImage || '/placeholder.svg'}
                          alt={item.product?.name || 'Produto'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary-800">{item.product?.name || 'Produto'}</h3>
                        <p className="text-sm text-primary-600">
                          {item.quantity}x R$ {item.product?.price?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <span className="font-bold text-primary-800">
                          R$ {((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )) || []}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary-800">Total:</span>
                      <span className="text-2xl font-bold text-primary-800">
                        R$ {order?.totalPrice?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Próximos Passos */}
          <Card className="bg-white shadow-lg border-primary-200 mt-8">
            <CardHeader>
              <CardTitle className="text-primary-800">Próximos Passos</CardTitle>
              <CardDescription>
                O que acontece agora?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-primary-800 mb-2">Processamento</h3>
                  <p className="text-sm text-gray-600">
                    Seu pedido está sendo verificado e será preparado em breve.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                    <ShoppingBag className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-primary-800 mb-2">Preparação</h3>
                  <p className="text-sm text-gray-600">
                    O vendedor irá preparar seus produtos com cuidado.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-primary-800 mb-2">Entrega</h3>
                  <p className="text-sm text-gray-600">
                    Seu pedido será entregue no endereço informado.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Button 
              onClick={() => router.push('/pedidos')}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 text-lg"
            >
              Ver Meus Pedidos
            </Button>
            
            <Button 
              onClick={() => router.push('/produtos')}
              variant="outline"
              className="border-primary-600 text-primary-600 hover:bg-primary-50 px-8 py-3 text-lg"
            >
              Continuar Comprando
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
