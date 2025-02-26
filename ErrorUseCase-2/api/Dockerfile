#Kudos to https://sabe.io/tutorials/how-to-deploy-deno-app-docker

FROM denoland/deno:latest

WORKDIR /app

COPY . ./

RUN deno cache index.ts

CMD ["task", "start"]