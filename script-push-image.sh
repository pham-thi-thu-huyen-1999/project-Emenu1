echo "----build image----"
docker-compose build

echo "----push image----"
docker push thonh4/omenu:client-staging