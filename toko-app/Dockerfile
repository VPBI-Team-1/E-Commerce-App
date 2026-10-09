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

# Dev: source mounted, Prisma client generated, hot reload
FROM base AS dev
WORKDIR /app
COPY . .
RUN npx prisma generate
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000
CMD ["npm", "run", "dev"]
