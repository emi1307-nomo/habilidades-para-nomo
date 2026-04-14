---
name: nextjs-deployment
description: Next.js production deployment — Docker multi-stage builds, GitHub Actions CI/CD, DigitalOcean, environment variables, health checks, OpenTelemetry monitoring. Use when deploying or setting up CI/CD for a Next.js app.
argument-hint: "[deployment target or CI/CD task]"
metadata:
  source: giuseppe-trisciuoglio/developer-kit
  version: "1.0.0"
---

# Next.js Deployment

Production deployment patterns for Next.js with Docker + GitHub Actions + DigitalOcean.

## next.config.ts — Standalone Output

```ts
// next.config.ts
import type { NextConfig } from "next"

const config: NextConfig = {
  output: "standalone", // optimized for Docker
  experimental: {
    serverActions: { allowedOrigins: [process.env.NEXT_PUBLIC_APP_URL!] }
  },
}

export default config
```

## Dockerfile — Multi-stage Build

```dockerfile
# Stage 1: Dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

# Stage 2: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_SERVER_ACTIONS_ENCRYPTION_KEY
ENV NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=$NEXT_SERVER_ACTIONS_ENCRYPTION_KEY

RUN npm run build

# Stage 3: Runtime
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy only what's needed from standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
```

## Health Check Endpoint

```ts
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: "ok", timestamp: new Date().toISOString() })
}
```

## GitHub Actions — CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy to DigitalOcean

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build Docker image
        run: |
          docker build \
            --build-arg NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=${{ secrets.ENCRYPTION_KEY }} \
            -t ${{ secrets.REGISTRY }}/app:${{ github.sha }} \
            -t ${{ secrets.REGISTRY }}/app:latest \
            .

      - name: Push to registry
        run: |
          echo ${{ secrets.REGISTRY_TOKEN }} | docker login registry.digitalocean.com -u ${{ secrets.REGISTRY_TOKEN }} --password-stdin
          docker push ${{ secrets.REGISTRY }}/app:${{ github.sha }}
          docker push ${{ secrets.REGISTRY }}/app:latest

      - name: Deploy to Droplet
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.DROPLET_HOST }}
          username: ${{ secrets.DROPLET_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /app
            docker pull ${{ secrets.REGISTRY }}/app:latest
            docker compose up -d --no-deps app
```

## Docker Compose — Production

```yaml
# docker-compose.yml
services:
  app:
    image: registry.digitalocean.com/your-registry/app:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
      - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  redis_data:
```

## Environment Variables

```bash
# .env.example — commit this (no secrets)
DATABASE_URL=postgresql://user:pass@localhost:5432/db
REDIS_URL=redis://localhost:6379
JWT_SECRET=                          # generate: openssl rand -base64 32
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=  # generate: openssl rand -base64 32
NEXT_PUBLIC_APP_URL=https://yourdomain.com
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_WEBHOOK_SECRET=
```

## Critical Rules

- **ALWAYS** set `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` for multi-server deployments
- **NEVER** commit `.env` files with real secrets
- Use `NEXT_PUBLIC_` prefix only for values safe to expose to the browser
- Run containers as non-root user
- Always include health check for container orchestrators
