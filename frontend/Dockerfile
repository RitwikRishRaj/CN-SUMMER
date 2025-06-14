FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache libc6-compat

# Copy package files first
COPY package*.json ./

# Copy lock file if exists
COPY package-lock.json* ./


# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Install build tools
RUN npm install --save-dev @vitejs/plugin-react terser

# Create a non-root user and switch to it
RUN addgroup -S appuser && adduser -S appuser -G appuser
RUN chown -R appuser:appuser /app
USER appuser

# Expose the port the app runs on
EXPOSE 5173

# Start the development server with host flag
CMD ["npm", "run", "dev", "--", "--host"]