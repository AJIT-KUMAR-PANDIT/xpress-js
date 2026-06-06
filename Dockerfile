# ===================================================================
# XPress-JS Dockerfile — Multi-stage build for production
# ===================================================================

# ── Stage 1: Build (install deps) ────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# ── Stage 2: Production image ────────────────────────────────────
FROM node:20-alpine
LABEL maintainer="NAKPRC"

WORKDIR /app

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Ensure uploads directory exists
RUN mkdir -p uploads logs && chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

CMD ["node", "src/server.js"]
