```bash
export EXTERNAL_IP=$(ipconfig getifaddr en0) && docker compose up -d --build
```

# Kong

https://docs.konghq.com/deck/latest/installation/

```bash
cd kong
deck gateway dump -o kong.yaml
```