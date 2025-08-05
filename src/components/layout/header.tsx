'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, User, LogOut } from 'lucide-react'

export function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="border-b bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-white drop-shadow-sm">
              🍺 Delivery App
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/produtos" 
              className="text-primary-50 hover:text-white transition-colors font-medium"
            >
              Produtos
            </Link>
            {session && (
              <Link 
                href="/pedidos" 
                className="text-primary-50 hover:text-white transition-colors font-medium"
              >
                Meus Pedidos
              </Link>
            )}
            {session?.user?.role === 'SELLER' && (
              <Link 
                href="/vendedor" 
                className="text-primary-50 hover:text-white transition-colors font-medium"
              >
                Dashboard
              </Link>
            )}
            {session?.user?.role === 'ADMINISTRATOR' && (
              <Link 
                href="/admin" 
                className="text-primary-50 hover:text-white transition-colors font-medium"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* User actions */}
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="animate-pulse bg-primary-300 h-8 w-20 rounded"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-primary-50 font-medium">
                  Olá, {session.user?.name || session.user?.email}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 bg-white text-primary-600 hover:bg-primary-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="secondary" size="sm" className="bg-white text-primary-600 hover:bg-primary-50 border-white">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/cadastro">
                  <Button size="sm" className="bg-secondary-500 hover:bg-secondary-600 text-white">
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
