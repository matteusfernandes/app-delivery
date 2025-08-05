'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useQuery } from 'react-query'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { toast } from '@/hooks/use-toast'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  price: number
  urlImage: string
  description?: string
  category?: string
  available: boolean
}

export default function ProductsPage() {
  const { data: session } = useSession()
  const { state: cartState, dispatch: cartDispatch } = useCart()
  const router = useRouter()
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})

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

  const getQuantity = (productId: string): number => {
    return quantities[productId] || 1
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return
    setQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }))
  }

  const addToCart = (product: Product) => {
    const quantity = getQuantity(product.id)
    
    cartDispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        imageUrl: product.urlImage
      }
    })
    
    toast({
      title: 'Produto adicionado',
      description: `${product.name} foi adicionado ao carrinho`,
    })
    
    // Reset quantity to 1 after adding
    setQuantities(prev => ({
      ...prev,
      [product.id]: 1
    }))
  }

  const getItemQuantityInCart = (productId: string): number => {
    const item = cartState.items.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

  const handleGoToCheckout = () => {
    if (cartState.items.length === 0) {
      toast({
        title: 'Carrinho vazio',
        description: 'Adicione produtos ao carrinho antes de finalizar',
        variant: 'destructive'
      })
      return
    }
    router.push('/checkout')
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-800 mb-4">Acesso Restrito</h1>
          <p className="text-primary-600">Faça login para ver os produtos.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
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
          <h1 className="text-2xl font-bold text-red-800 mb-4">Erro ao Carregar</h1>
          <p className="text-red-600">Não foi possível carregar os produtos.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary-800 mb-2">
              Produtos Disponíveis
            </h1>
            <p className="text-primary-600">
              Escolha seus produtos favoritos e adicione ao carrinho
            </p>
          </div>
          
          {cartState.items.length > 0 && (
            <Card className="bg-white shadow-lg border-primary-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="w-5 h-5 text-primary-600" />
                  <span className="font-semibold text-primary-800">
                    Carrinho ({cartState.totalItems} {cartState.totalItems === 1 ? 'item' : 'itens'})
                  </span>
                </div>
                <div className="space-y-1 text-sm text-primary-600 mb-3">
                  {cartState.items.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name} x{item.quantity}</span>
                      <span>R$ {item.subTotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2 mb-3">
                  <span className="text-primary-600 text-xl font-bold">
                    Total: R$ {cartState.totalPrice.toFixed(2)}
                  </span>
                </div>
                <Button 
                  onClick={handleGoToCheckout}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
                >
                  Finalizar Pedido
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product) => {
            const quantityInCart = getItemQuantityInCart(product.id)
            const selectedQuantity = getQuantity(product.id)
            
            return (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-primary-200">
                <CardHeader className="p-0">
                  <div className="relative w-full h-48 rounded-t-lg overflow-hidden">
                    <Image
                      src={product.urlImage}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {!product.available && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Badge variant="destructive" className="text-white">
                          Indisponível
                        </Badge>
                      </div>
                    )}
                    {quantityInCart > 0 && (
                      <Badge className="absolute top-2 right-2 bg-primary-600 text-white">
                        {quantityInCart} no carrinho
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <CardTitle className="text-xl text-primary-800 mb-2 line-clamp-2">
                    {product.name}
                  </CardTitle>
                  
                  {product.description && (
                    <CardDescription className="text-primary-600 mb-4 line-clamp-2">
                      {product.description}
                    </CardDescription>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary-600">
                      R$ {product.price.toFixed(2)}
                    </span>
                    {product.category && (
                      <Badge variant="secondary" className="bg-primary-100 text-primary-700">
                        {product.category}
                      </Badge>
                    )}
                  </div>
                  
                  {product.available && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(product.id, selectedQuantity - 1)}
                          disabled={selectedQuantity <= 1}
                          className="w-10 h-10 p-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        
                        <span className="text-lg font-semibold text-primary-800 min-w-[2rem] text-center">
                          {selectedQuantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(product.id, selectedQuantity + 1)}
                          className="w-10 h-10 p-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <Button 
                        onClick={() => addToCart(product)}
                        className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Adicionar ao Carrinho
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
        
        {cartState.items.length > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <Button 
              onClick={handleGoToCheckout}
              size="lg"
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Ver Carrinho (R$ {cartState.totalPrice.toFixed(2)})
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
