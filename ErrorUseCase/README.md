TODO

Run Seq: https://hub.docker.com/r/datalust/seq

docker run --name seq -d --restart unless-stopped -e ACCEPT_EULA=Y -p 5341:80 datalust/seq:latest


Tags:
- step 01: no way to know if the log is from the frontend or backend
- step 02: service name to know if the log is from the frontend or backend
- step 03: use case which returns an error 500