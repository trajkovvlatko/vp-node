const db = require('../config/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function create(table, options = {}) {
  switch (table) {
    case 'performers':
      return await addPerformer(options);
      break;
    case 'venues':
      return await addVenue(options);
      break;
    case 'genres':
      return await addGenres(options);
      break;
    case 'users':
      return await addUser(options);
      break;
    case 'genres_performers':
      return await addGenresPerformers(options);
      break;
    case 'bookings':
      return await addBookings(options);
      break;
    case 'images':
      return await addImage(options);
      break;
    case 'properties':
      return await addProperties(options);
      break;
    case 'properties_venues':
      return await addPropertiesVenues(options);
      break;
    case 'youtube_links':
      return await addYoutubeLinks(options);
      break;
  }
}

async function addUser(options) {
  const password = options.password || rand();
  const hash = await bcrypt.hash(password, saltRounds);
  const user = await db.one(
    `INSERT INTO public.users
    (name, email, password, active, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [
      options.name || rand(),
      options.email || `${rand()}@${rand()}.${rand()}`,
      hash,
      typeof options.active !== 'undefined' && options.active !== null
        ? options.active
        : true,
      options.created_at || new Date(),
      options.updated_at || new Date(),
    ],
  );
  return {...user, password: password};
}

async function addImage(options) {
  return await db.one(
    `INSERT INTO public.images
    (user_id, owner_id, owner_type, image, selected, created_at, updated_at)
    VALUES
    ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      options.user_id,
      options.owner_id,
      options.owner_type,
      options.image || `${rand()}.${rand()}`,
      typeof options.selected !== 'undefined' && options.selected !== null
        ? options.selected
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
      options.user_id,
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
      options.user_id,
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

async function addGenres(options) {
  return await db.one(
    `INSERT INTO public.genres
    (name, active, created_at, updated_at)
    VALUES($1, $2, $3, $4)
    RETURNING *`,
    [
      options.name || rand(),
      typeof options.active !== 'undefined' && options.active !== null
        ? options.active
        : true,
      options.created_at || new Date(),
      options.updated_at || new Date(),
    ],
  );
}

async function addGenresPerformers(options) {
  return await db.one(
    `INSERT INTO public.genres_performers
    (genre_id, performer_id, created_at, updated_at)
    VALUES($1, $2, $3, $4)
    RETURNING *`,
    [
      options.genre_id,
      options.performer_id,
      options.created_at || new Date(),
      options.updated_at || new Date(),
    ],
  );
}

async function addProperties(options) {
  return await db.one(
    `INSERT INTO public.properties
    (name, active, created_at, updated_at)
    VALUES($1, $2, $3, $4)
    RETURNING *`,
    [
      options.name || rand(),
      typeof options.active !== 'undefined' && options.active !== null
        ? options.active
        : true,
      options.created_at || new Date(),
      options.updated_at || new Date(),
    ],
  );
}

async function addPropertiesVenues(options) {
  return await db.one(
    `INSERT INTO public.properties_venues
    (property_id, venue_id, created_at, updated_at)
    VALUES($1, $2, $3, $4)
    RETURNING *`,
    [
      options.property_id,
      options.venue_id,
      options.created_at || new Date(),
      options.updated_at || new Date(),
    ],
  );
}

async function addYoutubeLinks(options) {
  return await db.one(
    `INSERT INTO public.youtube_links
    (owner_id, owner_type, link, user_id, created_at, updated_at)
    VALUES($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [
      options.owner_id,
      options.owner_type,
      options.link || `http://${rand()}.${rand()}`,
      options.user_id,
      options.created_at || new Date(),
      options.updated_at || new Date(),
    ],
  );
}

async function addBookings(options) {
  return await db.one(
    `INSERT INTO public.bookings (
      user_id,
      venue_id,
      performer_id,
      status,
      booking_date,
      created_at,
      updated_at
    )
    VALUES($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      options.user_id,
      options.venue_id,
      options.performer_id,
      options.status,
      options.booking_date,
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
