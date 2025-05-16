FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose backend server port
EXPOSE 5000

# Use nodemon if set up, or plain node
CMD ["npm", "run", "dev"]
