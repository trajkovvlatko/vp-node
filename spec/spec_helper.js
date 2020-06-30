const chai = require('chai');
const sequelize = require('../config/database');
const app = require('../app.js');
const fs = require('fs').promises;
const path = require('path');
console.log(sequelize.config);

async function loadDb() {
  await sequelize.query('DROP SCHEMA IF EXISTS public CASCADE;');
  await sequelize.query('CREATE SCHEMA public;');
  const fullPath = path.join(__dirname, 'database.sql');
  await fs.readFile(fullPath).then((sql) => sequelize.query(sql.toString()));
  console.log('------------ Database loaded -----------');
}

async function clearTables() {
  await sequelize.query('TRUNCATE TABLE public.users CASCADE;');
  await sequelize.query('TRUNCATE TABLE public.performers CASCADE;');
  await sequelize.query('TRUNCATE TABLE public.venues CASCADE;');
  await sequelize.query('TRUNCATE TABLE public.genres CASCADE;');
  await sequelize.query('TRUNCATE TABLE public.properties CASCADE;');
  await sequelize.query('TRUNCATE TABLE public.youtube_links CASCADE;');
  await sequelize.query('TRUNCATE TABLE public.images CASCADE;');
  await sequelize.query('TRUNCATE TABLE public.bookings CASCADE;');
}

before(async () => {
  await loadDb();
});

beforeEach(async () => {
  await clearTables();
});

async function authUser(user) {
  const url = `/auth/login?email=${user.email}&password=${user.password}`;
  const auth = await chai.request(app).post(url);
  return auth.body.token;
}

module.exports = {
  authUser,
};
