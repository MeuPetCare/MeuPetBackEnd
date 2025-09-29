# ----- DEV -----
FROM node:20-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
# nodemon precisa estar em devDependencies
# Scripts esperados no package.json:
# "start:dev": "nest start --watch"  (ou "nodemon src/main.ts")
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# ----- PROD -----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build

FROM node:20-alpine AS prod
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
