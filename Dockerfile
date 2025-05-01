# Etapa 1: Instala dependências e gera build
FROM node:20-alpine AS builder

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia package.json e package-lock.json (ou pnpm/yarn.lock)
COPY package*.json ./

# Instala dependências
RUN npm install --force

# Copia todo o restante da aplicação
COPY . .

# Copia o arquivo .env para o build
COPY .env .env

# Gera o build de produção do Next.js
RUN npm run build

# Instala apenas dependências de produção (removendo devs)
RUN npm prune --production --force

# Etapa 2: Cria a imagem de produção minimalista
FROM node:20-alpine AS runner

# Diretório de trabalho
WORKDIR /app

# Variável de ambiente obrigatória para produção
ENV NODE_ENV=production

# Copia apenas o necessário do build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.env .env

# Porta usada pelo Next.js (pode ser configurável)
EXPOSE 3000

# Comando para iniciar o app
CMD ["npm", "start"]
