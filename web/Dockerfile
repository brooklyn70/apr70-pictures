FROM node:22-alpine AS build

WORKDIR /app
RUN corepack enable pnpm && corepack prepare pnpm@9.15.4 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
ARG PUBLIC_PAYLOAD_URL=""
ENV PUBLIC_PAYLOAD_URL=${PUBLIC_PAYLOAD_URL}
RUN pnpm run build

FROM nginx:1.27-alpine AS runner
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
