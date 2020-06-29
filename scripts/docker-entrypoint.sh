set -e

echo "----- MIGRATE UP ----- sh"

DATABASE_URL=postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$DATABASE npm run migrate up

npm run watch
