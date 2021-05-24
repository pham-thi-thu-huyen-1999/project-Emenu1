# cd client
# echo "----build---"
# npm run-script build
# echo "----remove build runtime---"
# rm -rf ../run_client/build
# echo "----copy build---"
# cp -r build ../run_client
# echo "----remove build client---"
# rm -rf build

echo "----pull image----"
docker pull thonh4/omenu:client-staging

echo "----deploy----"
docker-compose up -d