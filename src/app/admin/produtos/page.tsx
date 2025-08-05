'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { 
  ArrowLeft,
  Package, 
  Search,
  Plus,
  Edit,
  Eye,
  EyeOff
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  price: number
  urlImage: string
  description: string | null
  category: string | null
  available: boolean
  createdAt: string
  _count: {
    orderItems: number
  }
}

export default function AdminProdutos() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL')

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

  const { data: products, isLoading } = useQuery<Product[]>(
    'admin-products',
    async () => {
      const response = await fetch('/api/admin/products')
      if (!response.ok) {
        throw new Error('Erro ao carregar produtos')
      }
      return response.json()
    },
    {
      enabled: !!session && session.user.role === 'ADMINISTRATOR',
    }
  )

  const toggleAvailabilityMutation = useMutation(
    async ({ productId, available }: { productId: string; available: boolean }) => {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ available }),
      })
      
      if (!response.ok) {
        throw new Error('Erro ao atualizar disponibilidade do produto')
      }
      
      return response.json()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-products')
        toast({
          title: 'Disponibilidade atualizada',
          description: 'A disponibilidade do produto foi atualizada com sucesso',
        })
      },
      onError: () => {
        toast({
          title: 'Erro ao atualizar',
          description: 'Não foi possível atualizar a disponibilidade do produto',
          variant: 'destructive',
        })
      },
    }
  )

  const handleToggleAvailability = (productId: string, currentAvailability: boolean) => {
    toggleAvailabilityMutation.mutate({ 
      productId, 
      available: !currentAvailability 
    })
  }

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

  // Filtrar produtos
  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesAvailability = availabilityFilter === 'ALL' || 
                               (availabilityFilter === 'AVAILABLE' && product.available) ||
                               (availabilityFilter === 'UNAVAILABLE' && !product.available)
    
    return matchesSearch && matchesAvailability
  }) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline" className="border-primary-300 text-primary-600 hover:bg-primary-50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Dashboard
                </Button>
              </Link>
              
              <div>
                <h1 className="text-4xl font-bold text-primary-800">
                  Gerenciar Produtos
                </h1>
                <p className="text-primary-600">
                  Visualize e gerencie todos os produtos do catálogo
                </p>
              </div>
            </div>
            
            <Button className="bg-primary-600 hover:bg-primary-700">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Produto
            </Button>
          </div>

          {/* Filters */}
          <Card className="bg-white shadow-lg border-primary-200 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar por nome, descrição ou categoria..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={availabilityFilter === 'ALL' ? 'default' : 'outline'}
                    onClick={() => setAvailabilityFilter('ALL')}
                    size="sm"
                  >
                    Todos
                  </Button>
                  <Button
                    variant={availabilityFilter === 'AVAILABLE' ? 'default' : 'outline'}
                    onClick={() => setAvailabilityFilter('AVAILABLE')}
                    size="sm"
                  >
                    Disponíveis
                  </Button>
                  <Button
                    variant={availabilityFilter === 'UNAVAILABLE' ? 'default' : 'outline'}
                    onClick={() => setAvailabilityFilter('UNAVAILABLE')}
                    size="sm"
                  >
                    Indisponíveis
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="bg-white shadow-lg border-primary-200">
                  <div className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded"></div>
                    </CardContent>
                  </div>
                </Card>
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Card key={product.id} className="bg-white shadow-lg border-primary-200 hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <div className="relative h-48 w-full">
                      <Image
                        src={product.urlImage}
                        alt={product.name}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant={product.available ? 'default' : 'secondary'}>
                        {product.available ? 'Disponível' : 'Indisponível'}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-primary-800 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    
                    {product.category && (
                      <Badge variant="outline" className="mb-2">
                        {product.category}
                      </Badge>
                    )}
                    
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-2xl font-bold text-primary-800">
                        R$ {product.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {product._count.orderItems} vendas
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={product.available}
                          onCheckedChange={() => handleToggleAvailability(product.id, product.available)}
                          disabled={toggleAvailabilityMutation.isLoading}
                        />
                        <span className="text-sm text-gray-600">
                          {product.available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </span>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-500">
                  Tente ajustar os filtros de pesquisa
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
