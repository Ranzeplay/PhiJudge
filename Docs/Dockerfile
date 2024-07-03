FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat

RUN corepack enable pnpm
RUN corepack use pnpm@latest

COPY . .
RUN pnpm install
RUN pnpm build

FROM nginx:stable-alpine as deploy

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
