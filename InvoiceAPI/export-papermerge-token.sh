CONTAINER_ID=$(docker ps -aqf "name=papermerge-worker")
docker exec $CONTAINER_ID create_token.sh admin