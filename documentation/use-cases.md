# 📚 Use Cases — Projeto "O Que é Amor"

## 🟰 1. Visitante acessa o site
**Descrição:**  
Visitante acessa a página inicial e visualiza o título e o campo para escrever sua definição de amor.

- **Ator:** Visitante (não autenticado)
- **Fluxo principal:**
  - Exibir título e campo de texto.
  - Exibir contador de definições já enviadas.
  - Mostrar lista pública de definições de outros usuários.
- **Pré-condição:** Nenhuma (acesso público).

## 🟰 2. Enviar uma definição de amor (não precisa estar logado)
**Descrição:**  
O visitante preenche o campo de texto e envia sua definição.

- **Ator:** Visitante
- **Fluxo principal:**
  - Usuário preenche o campo de texto.
  - Clica em "Enviar".
  - Sistema valida o texto (mínimo e máximo de caracteres, filtro básico contra spam/ofensas se quiser adicionar depois).
  - Armazena a definição no MongoDB.
  - Atualiza o contador de definições.
- **Pós-condição:** Definição disponível para todos verem.

## 🟰 3. Curtir uma definição
**Descrição:**  
O visitante pode curtir uma definição (❤️).

- **Ator:** Visitante
- **Fluxo principal:**
  - Clica no ícone de ❤️ de uma definição.
  - Incrementa o contador de curtidas no MongoDB.
  - (Opcional: limitar curtida por IP/session para evitar spam).

## 🟰 4. Criar conta (Cadastro/Login)
**Descrição:**  
Usuário cria conta para ter acesso a funcionalidades extras (favoritos, destaque, e-mail diário).

- **Ator:** Usuário
- **Fluxo principal:**
  - Preenche e-mail e senha (ou login social futuro, opcional).
  - Sistema cria novo usuário no MongoDB.
  - Autenticação usando NextAuth.js ou JWT local.
- **Pós-condição:** Usuário autenticado e sessão ativa.

## 🟰 5. Adicionar definição aos favoritos
**Descrição:**  
Usuário logado pode adicionar definições que gostou a uma lista de favoritos pessoais.

- **Ator:** Usuário autenticado
- **Fluxo principal:**
  - Clicar em botão ✨ em uma definição.
  - Salvar ID da definição no perfil do usuário no MongoDB.

## 🟰 5.1. Adicionar definição aos favoritos (sem pagar, após ver anúncio)
**Descrição:**  
Usuário autenticado pode adicionar uma definição aos seus favoritos sem pagar, caso veja um anúncio (ex.: Google Adsense ou outro ad).

- **Ator:** Usuário autenticado
- **Fluxo principal:**
  - Usuário clica em "Adicionar aos favoritos".
  - Sistema verifica:
    - Se o usuário é premium ➔ adiciona direto.
    - Se não for premium, pede para assistir/visualizar um anúncio.
  - Exibe o anúncio (Adsense ou vídeo de recompensa, estilo rewarded ad).
  - Após o anúncio ser visto (ou tempo mínimo visualizado), libera o favorito.
  - Salva o ID da definição no perfil do usuário no MongoDB.
- **Pré-condição:** Usuário deve estar logado.

## 🟰 6. Receber definição de amor diária por e-mail
**Descrição:**  
Usuário logado opta por receber uma definição por dia no e-mail.

- **Ator:** Usuário autenticado
- **Fluxo principal:**
  - Usuário ativa a opção "Receber definição diária" nas configurações.
  - Sistema agenda envio usando AWS SES.
  - Todo dia, um job (cron job) seleciona uma definição aleatória e envia via AWS SES.

## 🟰 7. Pagar para destacar sua definição
**Descrição:**  
Usuário paga para ter sua definição destacada no topo da lista por um tempo (ex.: 7 dias).

- **Ator:** Usuário autenticado
- **Fluxo principal:**
  - Usuário clica em "Destacar minha definição".
  - Escolhe método de pagamento (Cartão - Stripe ou Pix - Woovi).
  - Realiza o pagamento.
  - Após confirmação, o sistema marca a definição como Destacada no MongoDB.
  - Definição fica no topo da lista ou numa área de destaques por X dias.

## 🟰 8. Pagamento com Stripe (Cartão)
**Descrição:**  
Processar pagamento via cartão de crédito.

- **Ator:** Usuário autenticado
- **Fluxo principal:**
  - Integração do Checkout do Stripe.
  - Usuário insere dados do cartão.
  - Stripe processa pagamento e retorna sucesso/erro.
  - Em caso de sucesso, liberar o destaque da definição.

## 🟰 9. Pagamento com PIX (Woovi)
**Descrição:**  
Processar pagamento via PIX com integração Woovi.

- **Ator:** Usuário autenticado
- **Fluxo principal:**
  - Gerar QR Code Pix através da API da Woovi.
  - Mostrar o QR Code para o usuário.
  - Aguardar confirmação de pagamento via webhook.
  - Em caso de sucesso, liberar o destaque da definição.

## 🟰 10. Admin visualizar e moderar definições
**Descrição:**  
Um painel administrativo básico para visualizar, editar ou excluir definições, se necessário.

- **Ator:** Admin (você ou alguém autorizado)
- **Fluxo principal:**
  - Login admin.
  - Listar definições.
  - Botão de deletar ou remover destaque.

## 🛠️ Integrações Específicas

| Função            | Serviço          |
|-------------------|------------------|
| Hospedagem        | AWS App Runner   |
| Banco de Dados    | MongoDB          |
| E-mail            | AWS SES          |
| Pagamento Cartão  | Stripe           |
| Pagamento Pix     | Woovi            |
| Domínio           | GoDaddy          |