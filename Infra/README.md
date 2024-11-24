# Infrastructure documentation

```bash
export EXTERNAL_IP=$(ipconfig getifaddr en0) && docker compose up -d --build
```

## Kong

"Kong is an open-source API Gateway and Microservices Management Layer, delivering high performance and reliability."

### To backup and restore Kong configuration

Install deck: https://docs.konghq.com/deck/latest/installation/

Then: https://docs.konghq.com/deck/latest/guides/backup-restore/

Export configuration:

```bash
cd kong
deck gateway dump -o kong.yaml
```

Import configuration:

```bash
cd kong
deck gateway diff kong.yaml
deck gateway sync kong.yaml
```