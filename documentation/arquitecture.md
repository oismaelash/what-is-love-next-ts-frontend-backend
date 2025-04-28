# 📋 Arquitetura do Projeto — Projeto "O Que é Amor"

```bash
/oqueeamor-website
│
├── public/                     # Arquivos públicos (imagens, ícones, manifest, etc.)
│
├── src/                        # Todo o código principal fica aqui
│   ├── app/                    # App Router do Next.js
│   │   ├── components/         # Componentes reutilizáveis
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── DefinitionCard.jsx
│   │   │   ├── FavoriteButton.jsx
│   │   │   ├── AdRewardModal.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   │
│   │   ├── api/                # Rotas de API (backend)
│   │   │   ├── auth/           # Login, registro
│   │   │   │   ├── register.js
│   │   │   │   ├── login.js
│   │   │   │   └── session.js
│   │   │   │
│   │   │   ├── definitions/    # CRUD de definições
│   │   │   │   ├── create.js
│   │   │   │   ├── list.js
│   │   │   │   ├── like.js
│   │   │   │   ├── favorite.js
│   │   │   │   ├── highlight.js
│   │   │   │   └── validate.js  # Validação de conteúdo com OpenAI
│   │   │   │
│   │   │   ├── payment/        # Pagamentos Stripe + Woovi
│   │   │   │   ├── stripeCheckout.js
│   │   │   │   ├── wooviPix.js
│   │   │   │   └── webhook.js
│   │   │   │
│   │   │   ├── email/          # Envio de e-mails AWS SES
│   │   │   │   └── sendLoveDefinition.js
│   │   │   │
│   │   │   └── admin/          # APIs restritas para administração
│   │   │       ├── listDefinitions.js
│   │   │       ├── deleteDefinition.js
│   │   │       └── moderateDefinition.js
│   │   │
│   │   ├── pages/              # Páginas do Next.js
│   │   │   ├── index.jsx       # Página principal (enviar definição e ver outras)
│   │   │   ├── login.jsx       # Página de login
│   │   │   ├── register.jsx    # Página de cadastro
│   │   │   ├── favorites.jsx   # Lista de definições favoritas
│   │   │   ├── highlight.jsx   # Página de destaque de definições
│   │   │   └── admin/          # Painel de Admin
│   │   │       ├── dashboard.jsx
│   │   │       └── moderation.jsx
│   │
│   ├── lib/                    # Bibliotecas e utilitários
│   │   ├── dbConnect.js        # Conexão MongoDB
│   │   ├── auth.js             # Gerenciamento de autenticação (cookies, JWT)
│   │   ├── stripe.js           # Instância do Stripe SDK
│   │   ├── woovi.js            # Instância da API Woovi
│   │   ├── ses.js              # Instância AWS SES
│   │   ├── adsense.js          # Lógica de recompensa de anúncios
│   │   └── openai.js           # Instância e configuração da API OpenAI
│   │
│   ├── models/                 # Schemas do Mongoose
│   │   ├── User.js
│   │   ├── Definition.js
│   │   └── Favorite.js
│   │
│   ├── styles/                 # Estilos globais e temáticos
│   │   ├── globals.css
│   │   ├── theme.js            # Tema customizado do Material UI
│   │   └── variables.css
│   │
│   ├── context/                # Contextos globais (Auth, UI State)
│   │   ├── AuthContext.jsx
│   │   ├── FavoritesContext.jsx
│   │   └── AdsContext.jsx
│   │
│   ├── hooks/                  # Hooks personalizados
│   │   ├── useAuth.js
│   │   ├── useFavorites.js
│   │   └── useAdsReward.js
│   │
│   └── utils/                  # Utilidades gerais
│       ├── formatDate.js
│       ├── shuffleArray.js
│       ├── validateText.js
│       └── constants.js
│
├── .env.local                  # Variáveis de ambiente (Mongo URI, Stripe Keys, SES, etc)
├── next.config.js              # Configurações do Next.js
├── package.json                # Dependências do projeto
├── tailwind.config.js          # (Se usar Tailwind além do Material UI opcionalmente)
└── README.md                   # Documentação inicial
```

🛠️ Detalhes de Organização:

- **Frontend:**
  - Next.js (Páginas)
  - Material UI
  - Context API

- **Backend:**
  - API Routes Next.js (REST APIs internas)
  - OpenAI API para validação de conteúdo

- **Banco de Dados:**
  - MongoDB via Mongoose

- **E-mail:**
  - AWS SES via SDK da AWS

- **Pagamentos:**
  - Stripe (Cartão)
  - Woovi (PIX)

- **Hospedagem:**
  - AWS App Runner

- **Ads:**
  - Google Adsense (recompensa para favoritar)