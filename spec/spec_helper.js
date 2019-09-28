const chai = require('chai');
const db = require('../config/database');
const QueryFile = require('pg-promise').QueryFile;
const path = require('path');

async function loadDb() {
  await db.any('DROP SCHEMA IF EXISTS public CASCADE;');
  await db.any('CREATE SCHEMA public;');
  const fullPath = path.join(__dirname, 'database.sql');
  await db.any(new QueryFile(fullPath, {minify: true}), []);
}

async function clearTables() {
  await db.any('TRUNCATE TABLE public.users CASCADE;');
  await db.any('TRUNCATE TABLE public.performers CASCADE;');
  await db.any('TRUNCATE TABLE public.venues CASCADE;');
}

before(async () => {
  await loadDb();
});

beforeEach(async () => {
  await clearTables();
});
