import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  // Criar usuários
  const hashedPassword = await bcrypt.hash('123456', 10)
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Fulana Pereira',
        email: 'fulana@deliveryapp.com',
        password: hashedPassword,
        role: UserRole.ADMINISTRATOR,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Cliente Ze Birita',
        email: 'zebirita@email.com',
        password: hashedPassword,
        role: UserRole.CUSTOMER,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Vendedor Teste',
        email: 'vendedor@deliveryapp.com',
        password: hashedPassword,
        role: UserRole.SELLER,
      },
    }),
  ])

  console.log('✅ Usuários criados:', users.length)

  // Criar produtos
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Skol Lata 250ml',
        price: 2.20,
        urlImage: '/images/skol_lata_350ml.jpg',
        description: 'Cerveja Skol lata 250ml',
        category: 'Cervejas',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Heineken 600ml',
        price: 7.50,
        urlImage: '/images/heineken_600ml.jpg',
        description: 'Cerveja Heineken garrafa 600ml',
        category: 'Cervejas',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Antarctica Pilsen 300ml',
        price: 2.49,
        urlImage: '/images/antarctica_pilsen_300ml.jpg',
        description: 'Cerveja Antarctica Pilsen 300ml',
        category: 'Cervejas',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Brahma 600ml',
        price: 7.50,
        urlImage: '/images/brahma_600ml.jpg',
        description: 'Cerveja Brahma garrafa 600ml',
        category: 'Cervejas',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Skol 269ml',
        price: 2.19,
        urlImage: '/images/skol_269ml.jpg',
        description: 'Cerveja Skol 269ml',
        category: 'Cervejas',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Skol Beats Senses 313ml',
        price: 4.49,
        urlImage: '/images/skol_beats_senses_313ml.jpg',
        description: 'Skol Beats Senses 313ml',
        category: 'Cervejas',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Becks 330ml',
        price: 4.99,
        urlImage: '/images/becks_330ml.jpg',
        description: 'Cerveja Becks 330ml',
        category: 'Cervejas',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Brahma Duplo Malte 350ml',
        price: 2.79,
        urlImage: '/images/brahma_duplo_malte_350ml.jpg',
        description: 'Brahma Duplo Malte 350ml',
        category: 'Cervejas',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Becks 600ml',
        price: 8.89,
        urlImage: '/images/becks_600ml.jpg',
        description: 'Cerveja Becks 600ml',
        category: 'Cervejas',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Skol Beats Senses 269ml',
        price: 3.57,
        urlImage: '/images/skol_beats_senses_269ml.jpg',
        description: 'Skol Beats Senses 269ml',
        category: 'Cervejas',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Stella Artois 275ml',
        price: 3.49,
        urlImage: '/images/stella_artois_275ml.jpg',
        description: 'Cerveja Stella Artois 275ml',
        category: 'Cervejas',
      },
    }),
  ])

  console.log('✅ Produtos criados:', products.length)

  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
