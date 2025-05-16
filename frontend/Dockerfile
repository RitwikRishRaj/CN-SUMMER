FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install npm globally first
RUN npm install -g npm@latest

# Install shadcn-ui globally
RUN npm install -g shadcn-ui

# Copy package files
COPY package*.json ./

# Initialize shadcn-ui
RUN shadcn-ui@latest init

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the Vite dev server port
EXPOSE 5173

# Start Vite dev server
CMD ["npm", "run", "dev"]