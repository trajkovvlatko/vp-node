const fs = require('fs');
const env = process.env.NODE_ENV;
const data = fs.readFileSync('./config/default.json');
const config = JSON.parse(data).db[env];
const pgOptions = {
  // query(e) {
  //   console.log(e.query);
  // }
};
const pgp = require('pg-promise')(pgOptions);
const db = pgp(
  `postgres://${config.user}:${config.password}@${config.host}:${config.port}/${
    config.database
  }`,
);

module.exports = db;
