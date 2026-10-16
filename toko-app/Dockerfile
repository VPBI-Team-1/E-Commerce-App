# Base: install deps
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts

# Builder: generate Prisma, build Next.js
FROM base AS builder
COPY prisma ./prisma
COPY prisma.config.ts .env* ./
COPY next.config.ts tsconfig.json next-env.d.ts ./
RUN npx prisma generate
COPY . .
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build
