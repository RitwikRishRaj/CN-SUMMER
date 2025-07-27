# Stage 1: Build the application
FROM node:22.17.1-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package files
COPY package*.json ./

# Copy lock file if exists
COPY package-lock.json* ./

# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Install build tools
RUN npm install --save-dev @vitejs/plugin-react terser

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 5173

# Start the development server with host flag
CMD ["npm", "run", "dev", "--", "--host"]