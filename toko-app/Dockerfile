# Base: install deps
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder: generate Prisma, build Next.js
FROM base AS builder
COPY prisma ./prisma
COPY prisma.config.ts .env* ./
COPY next.config.ts tsconfig.json next-env.d.ts ./
RUN npx prisma generate
COPY . .
ENV NEXT_USE_WEBPACK=true
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--max-old-space-size=2048
RUN npm run build

# Runner: minimal image with built output
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=base /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/.env ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/next-env.d.ts ./
COPY --from=builder /app/tsconfig.json ./
ENV NODE_ENV=production
EXPOSE 3000
