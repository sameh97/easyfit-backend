FROM node:18

WORKDIR /app

# ✅ Copy everything first
COPY . .

# ✅ Install deps (now tsconfig.json is available)
RUN npm install

# Build the project
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/index.js"]
