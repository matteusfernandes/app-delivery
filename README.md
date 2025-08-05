# 🍺 App Delivery - Sistema de Entrega Modernizado

Uma aplicação completa de delivery modernizada com **Next.js 15**, **MongoDB** e **TypeScript**, oferecendo uma experiência moderna e responsiva para pedidos online.

## 🚀 Stack Tecnológica

### Frontend & Backend
- **Next.js 15** com App Router
- **TypeScript** para type safety
- **Tailwind CSS** + **Radix UI** para interface moderna
- **NextAuth.js** para autenticação segura

### Banco de Dados & ORM
- **MongoDB Atlas** (cloud database)
- **Prisma ORM** para manipulação de dados
- Schema moderno com relacionamentos otimizados

### Segurança & Performance
- **bcryptjs** para hash de senhas
- **JWT** tokens seguros
- Sistema de roles (Customer/Seller/Administrator)
- Validação de dados robusta

## ✨ Funcionalidades

### 🔐 Sistema de Autenticação
- Login e cadastro de usuários
- Autenticação com NextAuth.js
- Controle de acesso por roles
- Sessões seguras com JWT
- Redirecionamento inteligente baseado em roles

### 🛍️ Catálogo de Produtos
- Lista completa de bebidas com imagens
- Preços em tempo real
- Sistema de carrinho integrado
- Seleção de quantidade dinâmica
- Interface responsiva e moderna

### 🛒 Sistema de Carrinho Avançado
- Context API para gerenciamento de estado
- Adicionar/remover produtos em tempo real
- Cálculo automático de totais e subtotais
- Preview do carrinho em todas as páginas
- Checkout integrado com validação

### 💳 Processo de Checkout
- Seleção de vendedor responsável
- Validação de endereço de entrega
- Resumo completo do pedido
- Página de confirmação profissional
- Timing otimizado para melhor UX

### 📦 Gerenciamento de Pedidos
- Histórico completo de pedidos
- Tracking de status em tempo real
- Detalhes completos de cada pedido
- Interface específica por role de usuário

### 🏪 Dashboard do Vendedor
- Pedidos atribuídos ao vendedor
- Atualização de status dos pedidos
- Métricas de vendas
- Interface otimizada para gestão

### 👑 Dashboard Administrativo Completo
- **Estatísticas do Sistema:** Total de usuários, produtos, pedidos e receita
- **Gerenciamento de Usuários:** Alteração de roles, visualização de atividade
- **Controle de Produtos:** Toggle de disponibilidade, estatísticas de vendas
- **Monitoramento de Pedidos:** Visualização completa com filtros
- **Analytics de Vendedores:** Performance e métricas de cada vendedor
- **Pedidos Recentes:** Monitoramento em tempo real

### 👥 Gestão de Usuários
- **Customer:** Fazer pedidos, acompanhar status, histórico completo
- **Seller:** Gerenciar pedidos atribuídos, atualizar status
- **Administrator:** Controle total do sistema, analytics e gestão

## 🎨 Interface Moderna

- **Design Responsivo:** Funciona perfeitamente em desktop e mobile
- **Gradientes Modernos:** Interface atrativa com cores vibrantes
- **Componentes Reutilizáveis:** Arquitetura limpa e manutenível
- **Acessibilidade:** Cores com bom contraste e navegação intuitiva

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no MongoDB Atlas

### 1. Clone o repositório
```bash
git clone https://github.com/matteusfernandes/app-delivery.git
cd app-delivery
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env.local` baseado no `.env.example`:

```env
# Database
DATABASE_URL="sua-string-de-conexao-mongodb"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-super-seguro"

# Stripe (opcional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="sua-chave-publica"
STRIPE_SECRET_KEY="sua-chave-secreta"
```

### 4. Configure o banco de dados
```bash
# Gerar cliente Prisma
npx prisma generate

# Executar seed para dados de teste
npx prisma db seed
```

### 5. Execute o projeto
```bash
npm run dev
```

Acesse: `http://localhost:3000`

## 🧪 Credenciais de Teste

### 👤 Cliente
- **Email:** zebirita@email.com
- **Senha:** 123456

### 🏪 Vendedor
- **Email:** vendedor@deliveryapp.com
- **Senha:** 123456

### 👑 Administrador
- **Email:** fulana@deliveryapp.com
- **Senha:** 123456

## 📁 Estrutura do Projeto

```
app-delivery/
├── src/
│   ├── app/                    # App Router do Next.js
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Autenticação NextAuth
│   │   │   ├── products/      # Produtos
│   │   │   ├── orders/        # Pedidos
│   │   │   ├── sellers/       # Vendedores
│   │   │   └── admin/         # APIs administrativas
│   │   ├── login/             # Página de login
│   │   ├── cadastro/          # Página de cadastro
│   │   ├── produtos/          # Catálogo de produtos
│   │   ├── checkout/          # Processo de checkout
│   │   │   └── confirmacao/   # Confirmação de pedido
│   │   ├── pedidos/           # Histórico de pedidos
│   │   ├── vendedor/          # Dashboard do vendedor
│   │   └── admin/             # Dashboard administrativo
│   │       ├── usuarios/      # Gerenciamento de usuários
│   │       ├── produtos/      # Gerenciamento de produtos
│   │       ├── pedidos/       # Monitoramento de pedidos
│   │       └── vendedores/    # Analytics de vendedores
│   ├── components/            # Componentes reutilizáveis
│   │   ├── ui/               # Componentes base (Button, Card, etc)
│   │   └── layout/           # Layout components
│   ├── contexts/             # Context API (CartContext)
│   ├── lib/                  # Utilitários e configurações
│   └── types/                # Definições TypeScript
├── prisma/                   # Schema e configurações do banco
├── public/                   # Arquivos estáticos
│   └── images/              # Imagens dos produtos
└── legacy/                  # Código original preservado
```

## 🌍 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório no [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente
3. Deploy automático!

### Outras Plataformas
- **Netlify:** Suporte completo ao Next.js
- **Railway:** Deploy com banco incluído
- **Heroku:** Com add-on MongoDB

## 🔄 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Servidor de produção
npm run lint         # Executar ESLint
npm run lint:fix     # Corrigir problemas do ESLint
npm run type-check   # Verificar tipos TypeScript
npm run db:generate  # Gerar cliente Prisma
npm run db:push      # Sincronizar schema com banco
npm run db:studio    # Abrir Prisma Studio
npm run db:seed      # Popular banco com dados de teste
```

## 🎯 URLs e Acessos

### 🌐 Páginas Principais
- **Homepage:** `http://localhost:3000`
- **Login:** `http://localhost:3000/login`
- **Produtos:** `http://localhost:3000/produtos`
- **Checkout:** `http://localhost:3000/checkout`
- **Pedidos:** `http://localhost:3000/pedidos`

### 👥 Dashboards por Role
- **Vendedor:** `http://localhost:3000/vendedor`
- **Administrador:** `http://localhost:3000/admin`

### 🛠️ Ferramentas de Desenvolvimento
- **Prisma Studio:** `http://localhost:5555` (após `npm run db:studio`)
- **Next.js Dev:** `http://localhost:3000` (modo desenvolvimento)

## 🧬 Migração do Sistema Legacy

Este projeto foi completamente modernizado de:
- **React + Express + MySQL** → **Next.js 15 + MongoDB**
- Código original preservado em `/legacy/`
- Schema migrado com melhorias de performance
- Interface redesenhada com UX moderna

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Funcionalidades Implementadas

### ✅ Completas
- [x] Sistema de autenticação multi-role completo
- [x] Catálogo de produtos com carrinho integrado
- [x] Processo de checkout com seleção de vendedor
- [x] Página de confirmação profissional
- [x] Gerenciamento de pedidos para clientes
- [x] Dashboard completo para vendedores
- [x] Dashboard administrativo com analytics
- [x] Gerenciamento de usuários e roles
- [x] Controle de produtos e disponibilidade
- [x] Monitoramento de pedidos em tempo real
- [x] Sistema de métricas e estatísticas
- [x] Interface responsiva e moderna
- [x] Next.js 15 com TypeScript completo

### 🔄 Próximas Funcionalidades
- [ ] Sistema de avaliações e comentários
- [ ] Notificações push em tempo real
- [ ] Integração com múltiplos gateways de pagamento
- [ ] App mobile com React Native
- [ ] Sistema de cupons de desconto
- [ ] Relatórios avançados e exportação
- [ ] Chat em tempo real vendedor-cliente
- [ ] Sistema de fidelidade

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 💪 Tecnologias e Metodologias

- **Clean Architecture:** Código organizado e manutenível
- **TypeScript:** Type safety em todo o projeto
- **Responsive Design:** Interface adaptável a todos os dispositivos
- **Modern UI/UX:** Design system consistente
- **Security First:** Autenticação robusta e validação de dados
- **Performance:** Otimizações de build e runtime

---

## 📞 Contato

**Desenvolvido com ❤️ por [Matteus Fernandes](https://github.com/matteusfernandes)**

Para dúvidas ou sugestões, abra uma [issue](https://github.com/matteusfernandes/app-delivery/issues) no GitHub.

---

⭐ **Se este projeto foi útil para você, deixe uma estrela no repositório!**