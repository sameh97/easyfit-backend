FROM node:18

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript and assets
RUN npm run build

# Expose API port
EXPOSE 3000

# Run server
CMD ["node", "dist/index.js"]
