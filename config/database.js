const {Sequelize} = require('sequelize');
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';

const configFromEnv = () => {
  const host = process.env.POSTGRES_HOST;
  const port = process.env.POSTGRES_PORT;
  const user = process.env.POSTGRES_USER;
  const password = process.env.POSTGRES_PASSWORD;
  const database = process.env.POSTGRES_DB;
  if (host && port && user && password && database) {
    return {
      host,
      port,
      user,
      password,
      database,
    };
  } else {
    return;
  }
};

const configFromJSON = () => {
  const data = fs.readFileSync('./config/default.json');
  const {host, port, user, password, database} = JSON.parse(data).db[env];
  if (host && port && user && password && database) {
    return {
      host,
      port,
      user,
      password,
      database,
    };
  } else {
    return;
  }
};

const {host, port, user, password, database} =
  configFromEnv() || configFromJSON();

if (!host || !port || !user || !password || !database) {
  throw 'Invalid db setup.';
}

const dbString = `postgres://${user}:${password}@${host}:${port}/${database}`;
console.log(dbString);

const sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: 'postgres',
  schema: 'public',
  freezeTableName: true,
  logging: console.log,
});

module.exports = sequelize;
