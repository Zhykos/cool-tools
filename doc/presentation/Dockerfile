# Kudos to https://dev.to/borisuu/setup-vite-vuejs-docker-32fb

FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . ./

FROM builder AS prod-builder
RUN npm run build

FROM nginx:latest

COPY --from=prod-builder /usr/src/app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
