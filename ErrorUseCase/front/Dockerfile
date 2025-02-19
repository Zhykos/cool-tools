# Kudos to https://blog.bryanhannes.com/tutorial-run-qwik-in-docker/

FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

COPY . ./
RUN rm -rf .env
RUN mv .env.prod .env

RUN npm run build

# FROM nginx:latest

# COPY --from=prod-builder /usr/src/app/dist /usr/share/nginx/html

# CMD ["nginx", "-g", "daemon off;"]

FROM node:19.2-alpine3.15 AS production

# Set the working directory to /usr/src/app
WORKDIR /usr/src/app

# Only copy the results from the build over to the final image
# We do this to keep the final image as small as possible
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/server ./server
COPY --from=build /usr/src/app/dist ./dist

# Expose port 3000 (default port)
EXPOSE 3000

# Start the application
CMD [ "node", "server/entry.express"]