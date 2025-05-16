FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Install build tools
RUN npm install --save-dev @vitejs/plugin-react terser

# Build the application
RUN npm run build

# Start the application
CMD ["npx", "vite", "preview", "--port", "5173", "--host"]