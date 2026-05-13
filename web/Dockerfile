FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable pnpm && corepack prepare pnpm@9.15.4 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Inherit from deps so pnpm is available without a network download.
FROM deps AS build
COPY . .
RUN pnpm run build

FROM node:22-alpine AS runner
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 4321
ENV HOST=0.0.0.0
ENV PORT=4321

CMD ["node", "./dist/server/entry.mjs"]
