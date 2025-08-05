'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useQuery } from 'react-query'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { toast } from '@/hooks/use-toast'

interface Product {
  id: string
  name: string
  price: number
  urlImage: string
  description?: string
  category?: string
  available: boolean
}

interface CartItem {
  product: Product
  quantity: number
}

export default function ProductsPage() {
  const { data: session } = useSession()
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartTotal, setCartTotal] = useState(0)

  const { data: products, isLoading, error } = useQuery<Product[]>(
    'products',
    async () => {
      const response = await fetch('/api/products')
      if (!response.ok) {
        throw new Error('Erro ao carregar produtos')
      }
      return response.json()
    }
  )

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    setCartTotal(total)
  }, [cart])

  const addToCart = (product: Product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.product.id === product.id)
      
      if (existingItem) {
        return currentCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      
      return [...currentCart, { product, quantity: 1 }]
    })
    
    toast({
      title: 'Produto adicionado',
      description: `${product.name} foi adicionado ao carrinho`,
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.product.id === productId)
      
      if (existingItem && existingItem.quantity > 1) {
        return currentCart.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      }
      
      return currentCart.filter(item => item.product.id !== productId)
    })
  }

  const getItemQuantity = (productId: string) => {
    const item = cart.find(item => item.product.id === productId)
    return item ? item.quantity : 0
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: 'Carrinho vazio',
        description: 'Adicione produtos ao carrinho antes de finalizar',
        variant: 'destructive',
      })
      return
    }

    if (!session) {
      toast({
        title: 'Login necessário',
        description: 'Faça login para finalizar a compra',
        variant: 'destructive',
      })
      return
    }

    // Redirecionar para checkout
    window.location.href = '/checkout'
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar produtos</h2>
          <p className="text-gray-600">Tente novamente mais tarde.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">🍺 Nossos Produtos</h1>
            <p className="text-gray-700 text-lg">Escolha suas bebidas favoritas e receba geladas em casa!</p>
          </div>
          
          {cart.length > 0 && (
            <Card className="w-80 shadow-lg border-primary-200 bg-white/95 backdrop-blur-sm">
              <CardHeader className="pb-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Carrinho ({cart.length} {cart.length === 1 ? 'item' : 'itens'})
                </CardTitle>
              </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {cart.map(item => (
                  <div key={item.product.id} className="flex justify-between items-center text-sm">
                    <span className="truncate flex-1 mr-2">{item.product.name}</span>
                    <span className="text-gray-600">
                      {item.quantity}x R$ {item.product.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-b-lg p-4 -m-4 mt-4">
                <div className="flex justify-between items-center font-bold mb-4 text-lg">
                  <span className="text-gray-700">Total:</span>
                  <span className="text-primary-600 text-xl">R$ {cartTotal.toFixed(2)}</span>
                </div>
                <Button 
                  onClick={handleCheckout} 
                  className="w-full bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white font-semibold py-3 text-lg"
                >
                  🛒 Finalizar Pedido
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map(product => {
          const quantity = getItemQuantity(product.id)
          
          return (
            <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-2 border-transparent hover:border-primary-200">
              <div className="relative h-48 group">
                <Image
                  src={product.urlImage}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                {product.category && (
                  <Badge className="absolute top-2 right-2 bg-secondary-500 hover:bg-secondary-600 text-white">
                    {product.category}
                  </Badge>
                )}
                {!product.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive" className="text-lg px-4 py-2">
                      Indisponível
                    </Badge>
                  </div>
                )}
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-gray-900">{product.name}</CardTitle>
                {product.description && (
                  <CardDescription>{product.description}</CardDescription>
                )}
                <div className="text-2xl font-bold text-primary-600 mb-2">
                  R$ {product.price.toFixed(2)}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {product.available ? (
                  quantity > 0 ? (
                    <div className="flex items-center justify-between bg-primary-50 rounded-lg p-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeFromCart(product.id)}
                        className="border-primary-300 text-primary-600 hover:bg-primary-100"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-bold text-lg px-4 text-primary-700">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => addToCart(product)}
                        className="border-primary-300 text-primary-600 hover:bg-primary-100"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => addToCart(product)}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar ao Carrinho
                    </Button>
                  )
                ) : (
                  <Button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 cursor-not-allowed"
                  >
                    Indisponível
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {(!products || products.length === 0) && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Nenhum produto encontrado
          </h2>
          <p className="text-gray-600">
            Volte mais tarde para conferir nossos produtos.
          </p>
        </div>
      )}
      </div>
    </div>
  )
}
