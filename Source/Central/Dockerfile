FROM node:22-alpine AS base

FROM base AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat

RUN corepack enable pnpm
RUN corepack use pnpm@latest

COPY . .
RUN pnpm install
RUN pnpm build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT 3000

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["pnpm", "start"]
