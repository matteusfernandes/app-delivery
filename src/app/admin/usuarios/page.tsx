'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  ArrowLeft,
  Users, 
  Search,
  UserCheck,
  UserX,
  Crown,
  Store,
  User
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import Link from 'next/link'

interface UserData {
  id: string
  name: string
  email: string
  role: 'CUSTOMER' | 'SELLER' | 'ADMINISTRATOR'
  createdAt: string
  _count: {
    orders: number
    sellerOrders: number
  }
}

const getRoleInfo = (role: string) => {
  switch (role) {
    case 'ADMINISTRATOR':
      return {
        label: 'Administrador',
        color: 'bg-red-100 text-red-800',
        icon: Crown
      }
    case 'SELLER':
      return {
        label: 'Vendedor',
        color: 'bg-blue-100 text-blue-800',
        icon: Store
      }
    case 'CUSTOMER':
    default:
      return {
        label: 'Cliente',
        color: 'bg-green-100 text-green-800',
        icon: User
      }
  }
}

export default function AdminUsuarios() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')

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

  const { data: users, isLoading } = useQuery<UserData[]>(
    'admin-users',
    async () => {
      const response = await fetch('/api/admin/users')
      if (!response.ok) {
        throw new Error('Erro ao carregar usuários')
      }
      return response.json()
    },
    {
      enabled: !!session && session.user.role === 'ADMINISTRATOR',
    }
  )

  const updateRoleMutation = useMutation(
    async ({ userId, newRole }: { userId: string; newRole: string }) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })
      
      if (!response.ok) {
        throw new Error('Erro ao atualizar role do usuário')
      }
      
      return response.json()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-users')
        toast({
          title: 'Role atualizada',
          description: 'A role do usuário foi atualizada com sucesso',
        })
      },
      onError: () => {
        toast({
          title: 'Erro ao atualizar',
          description: 'Não foi possível atualizar a role do usuário',
          variant: 'destructive',
        })
      },
    }
  )

  const handleRoleUpdate = (userId: string, newRole: string) => {
    updateRoleMutation.mutate({ userId, newRole })
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

  // Filtrar usuários
  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter
    return matchesSearch && matchesRole
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
                Gerenciar Usuários
              </h1>
              <p className="text-primary-600">
                Visualize e gerencie todos os usuários do sistema
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
                      placeholder="Buscar por nome ou email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filtrar por role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos os Roles</SelectItem>
                    <SelectItem value="CUSTOMER">Clientes</SelectItem>
                    <SelectItem value="SELLER">Vendedores</SelectItem>
                    <SelectItem value="ADMINISTRATOR">Administradores</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card className="bg-white shadow-lg border-primary-200">
            <CardHeader>
              <CardTitle className="text-primary-800 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Usuários ({filteredUsers.length})
              </CardTitle>
              <CardDescription>
                Lista de todos os usuários cadastrados no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="space-y-4">
                  {filteredUsers.map((user) => {
                    const roleInfo = getRoleInfo(user.role)
                    const RoleIcon = roleInfo.icon
                    
                    return (
                      <div key={user.id} className="flex items-center justify-between p-4 border border-primary-100 rounded-lg hover:bg-primary-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <RoleIcon className="w-10 h-10 text-primary-600 bg-primary-100 rounded-full p-2" />
                          <div>
                            <h3 className="font-semibold text-primary-800">{user.name}</h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-xs text-gray-500">
                              Cadastrado em {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            {user.role === 'CUSTOMER' ? (
                              <>
                                <p className="text-sm font-semibold text-primary-800">
                                  {user._count.orders}
                                </p>
                                <p className="text-xs text-gray-600">Pedidos</p>
                              </>
                            ) : (
                              <>
                                <p className="text-sm font-semibold text-primary-800">
                                  {user._count.sellerOrders}
                                </p>
                                <p className="text-xs text-gray-600">Vendas</p>
                              </>
                            )}
                          </div>
                          
                          <Badge className={roleInfo.color}>
                            {roleInfo.label}
                          </Badge>
                          
                          {user.id !== session.user.id && (
                            <Select
                              value={user.role}
                              onValueChange={(newRole) => handleRoleUpdate(user.id, newRole)}
                              disabled={updateRoleMutation.isLoading}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="CUSTOMER">Cliente</SelectItem>
                                <SelectItem value="SELLER">Vendedor</SelectItem>
                                <SelectItem value="ADMINISTRATOR">Administrador</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                          
                          {user.id === session.user.id && (
                            <Badge variant="outline">
                              Você
                            </Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Nenhum usuário encontrado
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
