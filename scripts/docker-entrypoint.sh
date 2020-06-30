set -e

echo "----- COPY NODE_MODULES -----"

cp -r /usr/src/cache/node_modules/. /usr/src/app/node_modules/

echo "----- MIGRATE UP -----"

DATABASE_URL=postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$DATABASE npm run migrate up

npm run watch
