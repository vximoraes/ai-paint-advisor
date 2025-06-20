# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
COPY api-service/package.json ./api-service/
COPY ai-service/package.json ./ai-service/
RUN npm install
COPY ./ai-service/ ./ai-service/
COPY prisma ./prisma
RUN npx prisma generate
RUN cd ai-service && npm run build


# Stage 2: Production
FROM node:20-alpine
WORKDIR /usr/src/app/ai-service
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/ai-service/dist ./dist
COPY ./ai-service/package.json ./package.json
COPY ./ai-service/src/vector-store ./src/vector-store
EXPOSE 4001
CMD ["node", "dist/index.js"]