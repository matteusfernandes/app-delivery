import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 drop-shadow-sm">
            Bem-vindo ao <span className="text-primary-600">App Delivery</span>
            <span className="text-2xl block mt-2">🍺</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Modernizado com Next.js 15, TypeScript e MongoDB. 
            Desfrute das melhores cervejas com entrega rápida!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/produtos">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 text-lg">
                🛒 Ver Produtos
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="border-primary-600 text-primary-600 hover:bg-primary-50 px-8 py-3 text-lg">
                👤 Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Entrega Rápida</h3>
            <p className="text-gray-600">Receba seus produtos em até 30 minutos</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">❄️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Sempre Gelada</h3>
            <p className="text-gray-600">Produtos sempre na temperatura ideal</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Pagamento Fácil</h3>
            <p className="text-gray-600">Diversas formas de pagamento disponíveis</p>
          </div>
        </div>
      </div>
    </div>
  )
}
