'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Minus, Plus } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'

interface Seller {
  id: string
  name: string
  email: string
  role: string
}

export default function CheckoutPage() {
  const { data: session } = useSession()
  const { state: cartState, dispatch: cartDispatch } = useCart()
  const router = useRouter()
  
  const [selectedSeller, setSelectedSeller] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [deliveryNumber, setDeliveryNumber] = useState('')
  const [sellers, setSellers] = useState<Seller[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)

  // Buscar vendedores
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await fetch('/api/sellers', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const sellersData = await response.json()
          setSellers(sellersData)
        } else {
          console.error('Erro ao buscar vendedores:', response.status, response.statusText)
        }
      } catch (error) {
        console.error('Erro ao buscar vendedores:', error)
      }
    }

    fetchSellers()
  }, [session])

  // Aguardar a sessão carregar antes de redirecionar
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 3000) // Aumentado para 3 segundos

    return () => clearTimeout(timer)
  }, [])

  // Redirecionar se não estiver logado (após aguardar)
  useEffect(() => {
    if (!isInitialLoading && !session) {
      router.push('/login')
    }
  }, [session, router, isInitialLoading])

  // Redirecionar se carrinho vazio (após aguardar) - mas não se está submetendo pedido
  useEffect(() => {
    if (!isInitialLoading && cartState.items.length === 0 && !isSubmittingOrder) {
      const timer = setTimeout(() => {
        router.push('/produtos')
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [cartState.items.length, router, isInitialLoading, isSubmittingOrder])

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      cartDispatch({ type: 'REMOVE_ITEM', payload: { id: itemId } })
      return
    }
    
    cartDispatch({ 
      type: 'UPDATE_ITEM', 
      payload: { id: itemId, quantity: newQuantity } 
    })
  }

  const removeItem = (itemId: string) => {
    cartDispatch({ type: 'REMOVE_ITEM', payload: { id: itemId } })
    toast({
      title: 'Item removido',
      description: 'O item foi removido do seu carrinho',
    })
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedSeller) {
      toast({
        title: 'Selecione um vendedor',
        description: 'Escolha um vendedor responsável pelo pedido',
        variant: 'destructive'
      })
      return
    }

    if (!deliveryAddress.trim() || !deliveryNumber.trim()) {
      toast({
        title: 'Endereço incompleto',
        description: 'Preencha o endereço e número para entrega',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)
    setIsSubmittingOrder(true)

    try {
      const orderData = {
        sellerId: selectedSeller,
        deliveryAddress: deliveryAddress.trim(),
        deliveryNumber: deliveryNumber.trim(),
        totalPrice: cartState.totalPrice,
        status: 'Pendente',
        products: cartState.items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        const order = await response.json()
        
        // Limpar carrinho
        cartDispatch({ type: 'CLEAR_CART' })
        
        toast({
          title: 'Pedido realizado com sucesso!',
          description: `Seu pedido #${order.id.slice(-8)} foi criado e está sendo processado.`,
        })
        
        // Aguardar um pouco antes de redirecionar para evitar redirecionamento rápido demais
        setTimeout(() => {
          router.push(`/checkout/confirmacao/${order.id}`)
        }, 1500)
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao criar pedido')
      }
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      toast({
        title: 'Erro ao finalizar pedido',
        description: 'Tente novamente mais tarde',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-primary-800">Carregando...</h2>
        </div>
      </div>
    )
  }

  if (!session || cartState.items.length === 0) {
    return null // Componente irá redirecionar
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-primary-800 mb-8 text-center">
            Finalizar Pedido
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Lista de Produtos */}
            <Card className="bg-white shadow-lg border-primary-200">
              <CardHeader>
                <CardTitle className="text-primary-800">Seus Produtos</CardTitle>
                <CardDescription>
                  Revise os itens do seu pedido
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartState.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border border-primary-100 rounded-lg">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary-800">{item.name}</h3>
                        <p className="text-primary-600">R$ {item.price.toFixed(2)} cada</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-primary-800">
                          R$ {item.subTotal.toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-primary-200 mt-6 pt-6">
                  <div className="flex justify-between items-center text-xl font-bold text-primary-800">
                    <span>Total:</span>
                    <span>R$ {cartState.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Formulário de Entrega */}
            <Card className="bg-white shadow-lg border-primary-200">
              <CardHeader>
                <CardTitle className="text-primary-800">Dados de Entrega</CardTitle>
                <CardDescription>
                  Preencha as informações para finalizar seu pedido
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitOrder} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="seller">
                      Vendedor Responsável 
                      {sellers.length > 0 && (
                        <span className="text-sm text-primary-600 ml-2">
                          ({sellers.length} disponível{sellers.length !== 1 ? 'eis' : ''})
                        </span>
                      )}
                    </Label>
                    
                    <Select value={selectedSeller} onValueChange={setSelectedSeller}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={
                          sellers.length === 0 
                            ? "Carregando vendedores..." 
                            : "Selecione um vendedor"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {sellers.length === 0 ? (
                          <SelectItem value="loading" disabled>
                            Nenhum vendedor disponível
                          </SelectItem>
                        ) : (
                          sellers.map((seller) => (
                            <SelectItem key={seller.id} value={seller.id}>
                              {seller.name} ({seller.role === 'ADMINISTRATOR' ? 'Admin' : 'Vendedor'})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço de Entrega</Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="Rua, Avenida, etc."
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="number">Número</Label>
                    <Input
                      id="number"
                      type="number"
                      placeholder="123"
                      value={deliveryNumber}
                      onChange={(e) => setDeliveryNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="border-t border-primary-200 pt-6">
                    <div className="bg-primary-50 rounded-lg p-4 mb-6">
                      <h3 className="font-semibold text-primary-800 mb-2">Resumo do Pedido</h3>
                      <div className="space-y-1 text-sm text-primary-600">
                        <div className="flex justify-between">
                          <span>Subtotal ({cartState.totalItems} itens):</span>
                          <span>R$ {cartState.totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taxa de entrega:</span>
                          <span className="text-green-600">Grátis</span>
                        </div>
                        <div className="border-t border-primary-200 pt-2 mt-2">
                          <div className="flex justify-between font-bold text-primary-800">
                            <span>Total:</span>
                            <span>R$ {cartState.totalPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3 text-lg"
                    >
                      {isLoading ? 'Processando...' : 'Finalizar Pedido'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
