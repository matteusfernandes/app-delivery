'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: 'Erro no login',
          description: 'Email ou senha incorretos',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Login realizado',
          description: 'Bem-vindo de volta!',
        })
        
        const session = await getSession()
        
        // Redirecionar baseado no papel do usuário
        if (session?.user?.role === 'ADMINISTRATOR') {
          router.push('/admin')
        } else if (session?.user?.role === 'SELLER') {
          router.push('/vendedor')
        } else {
          router.push('/produtos')
        }
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-8">
      <div className="container mx-auto px-4">
        <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="text-6xl">🍺</div>
            <CardTitle className="text-3xl font-bold text-gray-900">Bem-vindo!</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Entre com suas credenciais para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 text-lg" 
              disabled={isLoading}
            >
              {isLoading ? '🔄 Entrando...' : '🚀 Entrar'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link 
              href="/cadastro" 
              className="text-sm text-primary-600 hover:text-primary-700 hover:underline font-medium"
            >
              Não tem conta? Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
