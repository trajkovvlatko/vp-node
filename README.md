create databases for dev and test
change values in config/default.json

npm i

run dev server:
./node_modules/nodemon/bin/nodemon.js DEBUG=vp-node:* npm start

run specs: npm run spec

run migrations with whole DATABASE_URL=... for now.

pg_dump --schema-only vp_development > spec/database.sql
