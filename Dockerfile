FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# 👇 força generate dentro do container
RUN npx prisma generate

CMD ["node", "src/server.js"]
