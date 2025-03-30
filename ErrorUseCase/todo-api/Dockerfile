#Kudos to https://sabe.io/tutorials/how-to-deploy-deno-app-docker

FROM denoland/deno:latest

WORKDIR /app

COPY . ./

RUN deno cache index.ts
RUN rm -rf .env

CMD ["run", "--allow-net", "--allow-env", "--allow-read", "--allow-write", "index.ts"]