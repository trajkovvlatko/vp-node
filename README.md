### Run locally

Create databases for dev and test

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

### Run in docker

#### App

- Check and edit .env and .env.test

```
docker-compose up --build
```

To add the seeds, open a new term window and run `docker ps`.
Get the app container id and run `docker exec -it CONTAINER_ID /bin/sh`.
Inside the container:
- `npm run seed` to add the seeds.

#### Tests

Get the test container id and run `docker exec -it CONTAINER_ID /bin/sh`.
- `npm run spec` to run the specs.

To remove containers, prune volume and rebuild docker run:

```
docker rm $(docker ps -a -q) -f
docker volume prune
docker-compose up --build
```
