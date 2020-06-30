Create databases for dev and test

Change values in `config/default.json` to match the database setup.

Rename `env` to `.env`, `env.test` to `.env.test` and fix the values.

Install dependencies

```
npm i
```

Run development server (with nodemon):

```
./node_modules/nodemon/bin/nodemon.js DEBUG=vp-node:* npm start
```

Run specs:

```
npm run spec
```

Run migrations:

```
npm run migrate up/down
```

Export database schema:

```
pg_dump --schema-only vp_development > spec/database.sql
```

Run in docker

- Check and edit .env and .env.test
- Check and edit config/default.json

```
docker-compose up --build
```

To add the seeds, open a new term window and run `docker ps`.
Get the app container id and run `docker exec -it CONTAINER_ID /bin/sh`.
Inside the container:
- `npm run seed` to add the seeds.
- `npm run spec` to run the specs.

To remove containers, prune volume and rebuild docker run:

```
docker rm $(docker ps -a -q) -f
docker volume prune
docker-compose up --build
```
