const fs = require('fs');
const env = process.env.NODE_ENV;
const data = fs.readFileSync('./config/default.json');
const config = JSON.parse(data).db[env];
const pgOptions = {
  query(e) {
    console.log(e.query);
  },
};
const pgp = require('pg-promise')(pgOptions);

const host = process.env.POSTGRES_HOST || config.host;
const port = process.env.POSTGRES_PORT || config.port;
const user = process.env.POSTGRES_USER || config.user;
const password = process.env.POSTGRES_PASSWORD || config.password;
const database = process.env.POSTGRES_DB || config.database;

const dbString = `postgres://${user}:${password}@${host}:${port}/${database}`;
console.log(dbString);
const db = pgp(dbString);

module.exports = db;
