TODO

Run Seq: https://hub.docker.com/r/datalust/seq

docker run --name seq -d --restart unless-stopped -e ACCEPT_EULA=Y -p 5341:80 datalust/seq:latest
