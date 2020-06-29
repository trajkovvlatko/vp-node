const {Sequelize} = require('sequelize');
const {host, port, user, password, database} = require('./get');

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
  logging: false, // console.log,
});

module.exports = sequelize;
