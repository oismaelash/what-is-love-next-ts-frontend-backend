# 📚 Use Cases — Projeto "O Que é Amor"

## 1. Autenticação e Gerenciamento de Usuário

### 1.1 Registro de Usuário
- **Cenário**: Novo usuário se registra no sistema
- **Pré-condições**: Usuário não está logado
- **Fluxo Principal**:
  1. Usuário acessa página de registro
  2. Preenche formulário com dados válidos
  3. Sistema valida dados
  4. Sistema cria conta
  5. Sistema redireciona para página inicial
- **Fluxos Alternativos**:
  - Dados inválidos: Sistema exibe mensagem de erro
  - Email já cadastrado: Sistema exibe mensagem de erro

### 1.2 Login
- **Cenário**: Usuário faz login no sistema
- **Pré-condições**: Usuário possui conta válida
- **Fluxo Principal**:
  1. Usuário acessa página de login
  2. Insere credenciais válidas
  3. Sistema autentica usuário
  4. Sistema redireciona para página inicial
- **Fluxos Alternativos**:
  - Credenciais inválidas: Sistema exibe mensagem de erro
  - Conta desativada: Sistema exibe mensagem apropriada

## 2. Gerenciamento de Definições de Amor

### 2.1 Criar Nova Definição
- **Cenário**: Usuário cria uma nova definição de amor
- **Pré-condições**: Usuário está autenticado
- **Fluxo Principal**:
  1. Usuário acessa página de criação
  2. Preenche formulário com definição
  3. Sistema valida conteúdo
  4. Sistema salva definição
  5. Sistema redireciona para lista de definições
- **Fluxos Alternativos**:
  - Conteúdo inválido: Sistema exibe mensagem de erro
  - Conteúdo muito longo: Sistema exibe mensagem de erro

### 2.2 Editar Definição Existente
- **Cenário**: Usuário edita uma definição existente
- **Pré-condições**: Usuário está autenticado e é dono da definição
- **Fluxo Principal**:
  1. Usuário acessa página de edição
  2. Modifica conteúdo da definição
  3. Sistema valida alterações
  4. Sistema salva alterações
  5. Sistema redireciona para lista de definições
- **Fluxos Alternativos**:
  - Conteúdo inválido: Sistema exibe mensagem de erro
  - Usuário não é dono: Sistema exibe mensagem de erro

### 2.3 Visualizar Definições
- **Cenário**: Usuário visualiza definições
- **Pré-condições**: Nenhuma
- **Fluxo Principal**:
  1. Usuário acessa página de definições
  2. Sistema exibe lista de definições
  3. Usuário pode filtrar e ordenar definições
- **Fluxos Alternativos**:
  - Sem definições: Sistema exibe mensagem apropriada
  - Filtro sem resultados: Sistema exibe mensagem apropriada

## 3. Interação Social

### 3.1 Curtir Definição
- **Cenário**: Usuário curte uma definição
- **Pré-condições**: Usuário está autenticado
- **Fluxo Principal**:
  1. Usuário visualiza definição
  2. Clica no botão de curtir
  3. Sistema registra curtida
  4. Sistema atualiza contador
- **Fluxos Alternativos**:
  - Usuário já curtiu: Sistema remove curtida
  - Erro na operação: Sistema exibe mensagem de erro

### 3.2 Comentar Definição
- **Cenário**: Usuário comenta uma definição
- **Pré-condições**: Usuário está autenticado
- **Fluxo Principal**:
  1. Usuário visualiza definição
  2. Digita comentário
  3. Sistema valida comentário
  4. Sistema salva comentário
  5. Sistema exibe comentário
- **Fluxos Alternativos**:
  - Comentário inválido: Sistema exibe mensagem de erro
  - Comentário muito longo: Sistema exibe mensagem de erro

## 4. Moderação

### 4.1 Reportar Conteúdo
- **Cenário**: Usuário reporta conteúdo inapropriado
- **Pré-condições**: Usuário está autenticado
- **Fluxo Principal**:
  1. Usuário visualiza conteúdo
  2. Clica no botão de reportar
  3. Seleciona motivo do report
  4. Sistema registra report
  5. Sistema notifica moderadores
- **Fluxos Alternativos**:
  - Usuário já reportou: Sistema exibe mensagem apropriada
  - Report inválido: Sistema exibe mensagem de erro

### 4.2 Moderar Conteúdo
- **Cenário**: Moderador avalia conteúdo reportado
- **Pré-condições**: Usuário é moderador
- **Fluxo Principal**:
  1. Moderador acessa painel de moderação
  2. Visualiza conteúdo reportado
  3. Toma decisão (aprove/rejeite)
  4. Sistema registra decisão
  5. Sistema notifica usuários envolvidos
- **Fluxos Alternativos**:
  - Conteúdo já moderado: Sistema exibe mensagem apropriada
  - Erro na operação: Sistema exibe mensagem de erro

## 5. Perfil do Usuário

### 5.1 Visualizar Perfil
- **Cenário**: Usuário visualiza perfil próprio ou de outro usuário
- **Pré-condições**: Nenhuma
- **Fluxo Principal**:
  1. Usuário acessa página de perfil
  2. Sistema exibe informações do perfil
  3. Sistema exibe definições do usuário
- **Fluxos Alternativos**:
  - Perfil privado: Sistema exibe mensagem apropriada
  - Perfil não encontrado: Sistema exibe mensagem de erro

### 5.2 Editar Perfil
- **Cenário**: Usuário edita seu próprio perfil
- **Pré-condições**: Usuário está autenticado
- **Fluxo Principal**:
  1. Usuário acessa página de edição de perfil
  2. Modifica informações desejadas
  3. Sistema valida alterações
  4. Sistema salva alterações
  5. Sistema redireciona para perfil
- **Fluxos Alternativos**:
  - Dados inválidos: Sistema exibe mensagem de erro
  - Erro na operação: Sistema exibe mensagem de erro

## 6. Destaque de Definições e Pagamentos

### 6.1 Solicitar Destaque de Definição
- **Cenário**: Usuário solicita destaque para sua definição
- **Pré-condições**: 
  - Usuário está autenticado
  - Definição pertence ao usuário
  - Definição não está em destaque
- **Fluxo Principal**:
  1. Usuário acessa página de destaque
  2. Seleciona definição para destacar
  3. Escolhe período de destaque
  4. Sistema calcula valor
  5. Sistema exibe opções de pagamento
  6. Usuário seleciona método de pagamento
  7. Sistema inicia processo de pagamento
- **Fluxos Alternativos**:
  - Definição já em destaque: Sistema exibe mensagem apropriada
  - Período inválido: Sistema exibe mensagem de erro
  - Erro no cálculo: Sistema exibe mensagem de erro

### 6.2 Pagamento com Cartão de Crédito
- **Cenário**: Usuário realiza pagamento com cartão de crédito
- **Pré-condições**: 
  - Usuário selecionou cartão de crédito como método
  - Valor já calculado
- **Fluxo Principal**:
  1. Sistema exibe formulário de cartão
  2. Usuário preenche dados do cartão
  3. Sistema valida dados do cartão
  4. Sistema processa pagamento
  5. Sistema recebe confirmação do gateway
  6. Sistema destaca definição
  7. Sistema envia email de confirmação
- **Fluxos Alternativos**:
  - Cartão inválido: Sistema exibe mensagem de erro
  - Cartão sem limite: Sistema exibe mensagem apropriada
  - Erro no processamento: Sistema exibe mensagem de erro

### 6.3 Pagamento com PIX
- **Cenário**: Usuário realiza pagamento com PIX
- **Pré-condições**: 
  - Usuário selecionou PIX como método
  - Valor já calculado
- **Fluxo Principal**:
  1. Sistema gera QR Code PIX
  2. Sistema gera código PIX copia e cola
  3. Usuário realiza pagamento
  4. Sistema monitora status do pagamento
  5. Sistema recebe confirmação via webhook
  6. Sistema destaca definição
  7. Sistema envia email de confirmação
- **Fluxos Alternativos**:
  - QR Code expirado: Sistema gera novo QR Code
  - Pagamento não confirmado: Sistema exibe mensagem apropriada
  - Erro no processamento: Sistema exibe mensagem de erro

### 6.4 Processamento de Webhook de Pagamento
- **Cenário**: Sistema processa notificação de pagamento
- **Pré-condições**: 
  - Pagamento iniciado
  - Webhook configurado
- **Fluxo Principal**:
  1. Sistema recebe notificação do gateway
  2. Sistema valida assinatura do webhook
  3. Sistema verifica status do pagamento
  4. Sistema atualiza status do pedido
  5. Sistema destaca definição (se pago)
  6. Sistema envia notificação ao usuário
- **Fluxos Alternativos**:
  - Assinatura inválida: Sistema registra tentativa de fraude
  - Status inesperado: Sistema registra log para análise
  - Erro no processamento: Sistema agenda retry

### 6.5 Gerenciamento de Destaques
- **Cenário**: Sistema gerencia destaque de definições
- **Pré-condições**: 
  - Definição em destaque
- **Fluxo Principal**:
  1. Sistema verifica período de destaque
  2. Sistema remove destaque ao expirar
  3. Sistema notifica usuário sobre expiração
  4. Sistema oferece opção de renovação
- **Fluxos Alternativos**:
  - Destaque removido manualmente: Sistema registra ação
  - Erro na remoção: Sistema agenda nova tentativa
  - Renovação solicitada: Sistema inicia novo processo de pagamento

## 7. Favoritos

### 7.1 Favoritar Definição
- **Cenário**: Usuário adiciona uma definição aos favoritos
- **Pré-condições**: 
  - Usuário está autenticado
  - Definição existe e está publicada
- **Fluxo Principal**:
  1. Usuário visualiza definição
  2. Clica no botão de favoritar
  3. Sistema adiciona definição aos favoritos
  4. Sistema atualiza contador de favoritos
  5. Sistema exibe confirmação visual
- **Fluxos Alternativos**:
  - Definição já favoritada: Sistema remove dos favoritos
  - Erro na operação: Sistema exibe mensagem de erro
  - Definição privada: Sistema exibe mensagem apropriada

### 7.2 Visualizar Favoritos
- **Cenário**: Usuário visualiza suas definições favoritas
- **Pré-condições**: 
  - Usuário está autenticado
- **Fluxo Principal**:
  1. Usuário acessa página de favoritos
  2. Sistema exibe lista de definições favoritas
  3. Usuário pode filtrar e ordenar favoritos
  4. Usuário pode remover favoritos
- **Fluxos Alternativos**:
  - Sem favoritos: Sistema exibe mensagem apropriada
  - Filtro sem resultados: Sistema exibe mensagem apropriada
  - Erro ao carregar: Sistema exibe mensagem de erro

### 7.3 Gerenciar Favoritos
- **Cenário**: Usuário gerencia suas definições favoritas
- **Pré-condições**: 
  - Usuário está autenticado
  - Usuário tem favoritos
- **Fluxo Principal**:
  1. Usuário acessa página de favoritos
  2. Sistema exibe opções de gerenciamento
  3. Usuário pode:
     - Remover favoritos individualmente
     - Remover todos os favoritos
     - Exportar lista de favoritos
     - Organizar favoritos em categorias
  4. Sistema salva alterações
- **Fluxos Alternativos**:
  - Erro ao remover: Sistema exibe mensagem de erro
  - Erro ao exportar: Sistema exibe mensagem de erro
  - Erro ao categorizar: Sistema exibe mensagem de erro

### 7.4 Notificações de Favoritos
- **Cenário**: Sistema notifica usuário sobre atualizações em definições favoritas
- **Pré-condições**: 
  - Usuário tem definições favoritas
  - Definição favorita foi atualizada
- **Fluxo Principal**:
  1. Sistema detecta atualização em definição favorita
  2. Sistema verifica preferências de notificação do usuário
  3. Sistema envia notificação apropriada
  4. Usuário pode visualizar atualização
- **Fluxos Alternativos**:
  - Notificações desativadas: Sistema não envia notificação
  - Erro ao enviar notificação: Sistema registra log
  - Usuário não visualiza notificação: Sistema mantém histórico

## 8. Compartilhamento

### 8.1 Compartilhar Definição
- **Cenário**: Usuário compartilha uma definição
- **Pré-condições**: 
  - Definição existe e está publicada
  - Usuário tem permissão para visualizar a definição
- **Fluxo Principal**:
  1. Usuário visualiza definição
  2. Clica no botão de compartilhar
  3. Sistema exibe opções de compartilhamento:
     - Redes sociais (Facebook, Twitter, Instagram, WhatsApp)
     - Link direto
     - Email
     - Código QR
  4. Usuário seleciona método de compartilhamento
  5. Sistema gera conteúdo compartilhável
  6. Sistema registra ação de compartilhamento
- **Fluxos Alternativos**:
  - Definição privada: Sistema exibe mensagem apropriada
  - Erro ao gerar link: Sistema exibe mensagem de erro
  - Erro ao compartilhar: Sistema exibe mensagem de erro

### 8.2 Compartilhamento via Redes Sociais
- **Cenário**: Usuário compartilha definição em redes sociais
- **Pré-condições**: 
  - Usuário selecionou compartilhamento em rede social
  - Usuário está logado na rede social (se necessário)
- **Fluxo Principal**:
  1. Sistema gera preview do compartilhamento
  2. Sistema inclui:
     - Título da definição
     - Autor
     - Imagem de preview
     - Link direto
     - Hashtags relevantes
  3. Usuário confirma compartilhamento
  4. Sistema redireciona para rede social
  5. Sistema registra compartilhamento
- **Fluxos Alternativos**:
  - Rede social não disponível: Sistema exibe mensagem apropriada
  - Erro na integração: Sistema exibe mensagem de erro
  - Usuário cancela: Sistema retorna à definição

### 8.3 Compartilhamento via Link
- **Cenário**: Usuário compartilha link da definição
- **Pré-condições**: 
  - Usuário selecionou compartilhamento via link
- **Fluxo Principal**:
  1. Sistema gera link único
  2. Sistema oferece opções:
     - Copiar link
     - Gerar QR Code
     - Encurtar link
  3. Usuário seleciona opção
  4. Sistema executa ação selecionada
  5. Sistema registra geração do link
- **Fluxos Alternativos**:
  - Link expirado: Sistema gera novo link
  - Erro ao gerar QR Code: Sistema exibe mensagem de erro
  - Erro ao encurtar link: Sistema exibe mensagem de erro

### 8.4 Compartilhamento via Email
- **Cenário**: Usuário compartilha definição por email
- **Pré-condições**: 
  - Usuário selecionou compartilhamento via email
- **Fluxo Principal**:
  1. Sistema exibe formulário de email
  2. Usuário preenche:
     - Email do destinatário
     - Mensagem personalizada (opcional)
  3. Sistema valida email
  4. Sistema envia email com:
     - Link da definição
     - Preview da definição
     - Mensagem personalizada
  5. Sistema registra envio
- **Fluxos Alternativos**:
  - Email inválido: Sistema exibe mensagem de erro
  - Erro no envio: Sistema exibe mensagem de erro
  - Spam detectado: Sistema exibe mensagem apropriada

### 8.5 Visualização de Definição Compartilhada
- **Cenário**: Usuário acessa definição compartilhada
- **Pré-condições**: 
  - Link da definição é válido
  - Usuário tem permissão para visualizar
- **Fluxo Principal**:
  1. Usuário acessa link compartilhado
  2. Sistema verifica permissões
  3. Sistema exibe definição
  4. Sistema registra visualização
  5. Sistema oferece opções de interação
- **Fluxos Alternativos**:
  - Link inválido: Sistema exibe mensagem apropriada
  - Definição privada: Sistema exibe mensagem apropriada
  - Definição removida: Sistema exibe mensagem apropriada

### 8.6 Estatísticas de Compartilhamento
- **Cenário**: Sistema rastreia estatísticas de compartilhamento
- **Pré-condições**: 
  - Definição foi compartilhada
- **Fluxo Principal**:
  1. Sistema registra cada compartilhamento
  2. Sistema categoriza por:
     - Método de compartilhamento
     - Data/hora
     - Origem do acesso
  3. Sistema gera relatórios
  4. Sistema exibe estatísticas para o autor
- **Fluxos Alternativos**:
  - Erro no registro: Sistema tenta novamente
  - Dados corrompidos: Sistema exibe mensagem de erro
  - Sem permissão: Sistema exibe mensagem apropriada
