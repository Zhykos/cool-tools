#

To send data to papermerge: https://docs.papermerge.io/3.0/rest-api/token/

```shell
docker ps
docker exec <DOCKER CONTAINER> create_token.sh admin
./mvnw quarkus:dev -Dged.token=<TOKEN>
```
