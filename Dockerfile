# Stage 1: Build
FROM node:22-slim AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN apt-get update -y && apt-get install -y openssl
RUN npm install
COPY . .
COPY prisma ./prisma
COPY data ./data
RUN npx prisma generate
RUN npm run build
RUN ls -l /usr/src/app/dist

# Stage 2: Production
FROM node:22-slim
WORKDIR /usr/src/app
RUN apt-get update -y && apt-get install -y openssl
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/data ./data
ENV NODE_ENV=production
CMD ["node", "dist/server.js"]