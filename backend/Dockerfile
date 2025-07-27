# Stage 1: Build the application
FROM node:22.17.1-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies)
RUN npm ci

# Copy source code
COPY . .

# Build the application (if needed)
# RUN npm run build

# Stage 2: Production image
FROM node:22.17.1-alpine

WORKDIR /app

# Install production dependencies only
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# Copy built application
COPY --from=builder /app .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Expose the application port
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]
