const db = require('../config/database');

async function create(table, options = {}) {
  switch (table) {
    case 'performers':
      return await addPerformer(options);
      break;
    case 'venues':
      return await addVenue(options);
      break;
    case 'users':
      return await addUser(options);
      break;
  }
}

async function addUser(options) {
  return await db.one(
    `INSERT INTO public.users
    (name, email, password, active, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [
      options.name || rand(),
      options.email || `${rand()}@${rand()}.${rand()}`,
      options.password || rand(),
      typeof options.active !== 'undefined' && options.active !== null
        ? options.active
        : true,
      options.created_at || new Date(),
      options.updated_at || new Date(),
    ],
  );
}

async function addPerformer(options) {
  return await db.one(
    `INSERT INTO public.performers
    (name, user_id, location, phone, active, created_at, updated_at)
    VALUES($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      options.name || rand(),
      options.userId,
      options.location || rand(),
      options.phone || rand(),
      typeof options.active !== 'undefined' && options.active !== null
        ? options.active
        : true,
      options.created_at || new Date(),
      options.updated_at || new Date(),
    ],
  );
}

async function addVenue(options) {
  return await db.one(
    `INSERT INTO public.venues
    (name, user_id, location, phone, active, created_at, updated_at)
    VALUES($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      options.name || rand(),
      options.userId,
      options.location || rand(),
      options.phone || rand(),
      typeof options.active !== 'undefined' && options.active !== null
        ? options.active
        : true,
      options.created_at || new Date(),
      options.updated_at || new Date(),
    ],
  );
}

function rand() {
  return Math.random()
    .toString(36)
    .substring(7);
}

module.exports = create;
