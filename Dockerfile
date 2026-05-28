FROM oven/bun:alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install

COPY prisma ./prisma
COPY prisma.config.ts .

RUN bunx prisma generate

COPY tsconfig.json .
COPY tsconfig.build.json .
COPY nest-cli.json .

COPY src ./src

RUN bun run build


FROM oven/bun:alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

CMD ["bun", "run", "start:prod"]