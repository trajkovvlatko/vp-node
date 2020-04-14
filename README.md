Create databases for dev and test


Change values in `config/default.json` to match the database setup.

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
```
docker-compose up --build
```

Remove containers, prune volume and rebuild docker
```
docker rm $(docker ps -a -q) -f
docker volume prune
docker-compose up --build
```
