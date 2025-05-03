# Analytics Customizado

## 1. **Analytics Gerais Possíveis**

### **Usuários**
- Total de usuários cadastrados
- Novos cadastros por período (dia, semana, mês)
- Usuários ativos (login, ações recentes)
- Usuários que favoritaram/curtiram/compartilharam definições

### **Definições (Conteúdo)**
- Total de definições criadas
- Novas definições por período
- Definições mais curtidas, mais favoritedas, mais compartilhadas
- Definições em destaque (highlighted)
- Evolução do número de definições ao longo do tempo

### **Engajamento**
- Total de curtidas, favoritos e compartilhamentos por definição
- Total de curtidas, favoritos e compartilhamentos por usuário
- Evolução de curtidas, favoritos e compartilhamentos ao longo do tempo
- Quais usuários mais engajam (curtem, favoritam, compartilham)
- Quais definições recebem mais engajamento

### **Funil de Criação**
- Quantos usuários criam definições após o cadastro
- Taxa de aprovação de definições (caso haja moderação)
- Tempo médio entre cadastro e primeira definição criada

### **Retenção**
- Quantos usuários retornam após o primeiro acesso
- Frequência de uso (quantas vezes o usuário acessa/interage)

## 2. **Como Extrair Esses Dados**

Você pode extrair esses dados diretamente do banco de dados, pois:
- O modelo `User` armazena favoritos, likes e data de criação.
- O modelo `Definition` armazena autor, likes, shares, favoritos, data de criação e se está em destaque.
- Os endpoints de API registram ações como curtir, favoritar, compartilhar e criar definições.

### Exemplos de queries para analytics:
- **Total de definições criadas por dia:** Agrupar por `createdAt` em `Definition`.
- **Definições mais curtidas:** Ordenar por `likes` em `Definition`.
- **Usuários mais ativos:** Contar ações (criação, like, favorito) por usuário.
- **Engajamento por definição:** Somar `likes`, `shares` e quantidade de favoritos.
- **Retenção:** Verificar datas de `createdAt` e últimas ações dos usuários.

## 3. **Limitações**
- Não há tracking de visualização de página ou tempo de permanência (isso só seria possível com um script frontend).
- Não há tracking de eventos customizados do frontend (ex: cliques em botões que não envolvem API).
- Não há tracking de origem do tráfego (ex: de onde veio o usuário).

## 4. **Sugestão**
Se quiser um analytics mais detalhado (ex: visualizações de página, funil de navegação, eventos customizados), pode criar um endpoint para registrar eventos do frontend e salvar em uma coleção de "eventos" no banco, ou integrar uma ferramenta de analytics.

## 5. **Exemplos de Queries para Analytics**

### **a) Total de definições criadas por dia**
```js
// MongoDB Aggregation Example
Definition.aggregate([
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      total: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
])
```

### **b) Definições mais curtidas**
```js
Definition.find().sort({ likes: -1 }).limit(10)
```

### **c) Usuários mais ativos (por número de definições criadas)**
```js
Definition.aggregate([
  { $group: { _id: "$author", total: { $sum: 1 } } },
  { $sort: { total: -1 } },
  { $limit: 10 }
])
```

### **d) Engajamento por definição (likes, shares, favoritos)**
```js
Definition.find().sort({ likes: -1, shares: -1 }).limit(10)
```
Para favoritos, você pode contar quantos usuários têm cada definição no array `favorites`.

### **e) Retenção de usuários (usuários que voltaram após o cadastro)**
Você pode comparar `createdAt` do usuário com a data da última ação (ex: último like, favorito, definição criada).

## 6. **Criando um Endpoint para Eventos Customizados**

Se quiser registrar eventos do frontend (ex: visualização de página, clique em botão, etc.), crie um endpoint como este:

### **a) Endpoint de eventos**
```ts
// src/app/api/events/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/models/Event'; // Crie um model Event

export async function POST(request: Request) {
  try {
    const { type, userId, metadata } = await request.json();

    await connectDB();

    await Event.create({
      type,      // ex: 'page_view', 'button_click'
      userId,    // opcional, se o usuário estiver logado
      metadata,  // qualquer informação extra (ex: página, botão, timestamp)
      createdAt: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao registrar evento' }, { status: 500 });
  }
}
```

### **b) Model para eventos**
```ts
// src/models/Event.ts
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  type: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  metadata: Object,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Event || mongoose.model('Event', eventSchema);
```

### **c) Como usar no frontend**
```js
fetch('/api/events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'page_view',
    userId: user?._id, // se disponível
    metadata: { page: '/definicoes' }
  })
});
```

## 7. **O que você pode medir com esse endpoint**
- Visualizações de página
- Cliques em botões específicos
- Abertura de modais
- Qualquer ação do usuário no frontend

---

Se quiser exemplos de queries para analisar esses eventos ou dicas para implementar no frontend, só pedir! 