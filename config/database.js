const fs = require('fs');
const data = fs.readFileSync('./config/default.json');
const config = JSON.parse(data).db;
const pgp = require('pg-promise')();
const db = pgp(
  `postgres://${config.user}:${config.password}@${config.host}:${config.port}/${
    config.database
  }`,
);

module.exports = db;
