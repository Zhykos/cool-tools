TODO

Run Seq: https://hub.docker.com/r/datalust/seq

docker run --name seq -d --restart unless-stopped -e ACCEPT_EULA=Y -p 5341:80 datalust/seq:latest

https://opentelemetry.io/docs/languages/js/instrumentation/

Tags:
- step 01: no way to know if the log is from the frontend or backend
- step 02: service name to know if the log is from the frontend or backend
- step 03: use case which returns an error 500
- step 04: log the error, server side
- step 05: create traceId-ish
- step 06: add OpenTelemetry auto-instrumentation in frontend
- step 07: use real OpenTelemetry span in frontend and the logs now have the traceId
- step 08: full OpenTelemetry tracing (manual instrumentation)
