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

Run migrations (with whole DATABASE_URL=... for now), for ex.:
```
DATABASE_URL=postgres://user:password@localhost:5432/vp_development NODE_ENV=development ./node_modules/node-pg-migrate/bin/node-pg-migrate up/down
```

Export database schema:
```
pg_dump --schema-only vp_development > spec/database.sql
```
