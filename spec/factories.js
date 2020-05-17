const models = require('../app/models');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const sequelize = require('../config/database');

async function create(table, options = {}) {
  switch (table) {
    case 'performers':
      return await addPerformer(options);
      break;
    case 'venues':
      return await addVenue(options);
      break;
    case 'genres':
      return await addGenre(options);
      break;
    case 'genres_performers':
      return await addGenrePerformer(options);
      break;
    case 'users':
      return await addUser(options);
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
    case 'youtube_links':
      return await addYoutubeLinks(options);
      break;
    case 'properties_venues':
      return await addPropertyVenue(options);
      break;
    default:
      throw `No factory for table '${table}'`;
  }
}

async function addGenrePerformer(options) {
  return await sequelize.query(`
    INSERT INTO public.genres_performers
      ("genreId", "performerId", "createdAt", "updatedAt")
    VALUES (${options.genreId}, ${options.performerId}, now(), now())
    RETURNING *;`);
}

async function addPropertyVenue(options) {
  return await sequelize.query(`
    INSERT INTO public.properties_venues
      ("venueId", "propertyId", "createdAt", "updatedAt")
    VALUES (${options.venueId}, ${options.propertyId}, now(), now())
    RETURNING *;`);
}

async function addUser(options) {
  const password = options.password || rand();
  const hash = await bcrypt.hash(password, saltRounds);
  const user = models.User.build({
    name: options.name || rand(),
    email: options.email || `${rand()}@${rand()}.${rand()}`,
    password: hash,
    active:
      typeof options.active !== 'undefined' && options.active !== null
        ? options.active
        : true,
    createdAt: options.createdAt || new Date(),
    updatedAt: options.updatedAt || new Date(),
  });
  await user.save();
  return {...user.dataValues, password: password};
}

async function addImage(options) {
  const image = models.Image.build({
    userId: options.userId,
    ownerId: options.ownerId,
    ownerType: options.ownerType,
    image: options.image || `${rand()}.${rand()}`,
    selected:
      typeof options.selected !== 'undefined' && options.selected !== null
        ? options.selected
        : true,
    createdAt: options.createdAt || new Date(),
    updatedAt: options.updatedAt || new Date(),
  });
  await image.save();
  return image;
}

async function addPerformer(options) {
  const performer = models.Performer.build({
    name: options.name || rand(),
    userId: options.userId,
    location: options.location || rand(),
    phone: options.phone || rand(),
    details: options.details || rand(),
    website: options.website || rand(),
    rating: options.rating || 2,
    active:
      typeof options.active !== 'undefined' && options.active !== null
        ? options.active
        : true,
    createdAt: options.createdAt || new Date(),
    updatedAt: options.updatedAt || new Date(),
  });
  await performer.save();
  return performer;
}

async function addVenue(options) {
  return await models.Venue.create({
    name: options.name || rand(),
    userId: options.userId,
    location: options.location || rand(),
    phone: options.phone || rand(),
    rating: options.rating || 2,
    active:
      typeof options.active !== 'undefined' && options.active !== null
        ? options.active
        : true,
    createdAt: options.createdAt || new Date(),
    updatedAt: options.updatedAt || new Date(),
  });
}

async function addGenre(options) {
  return await models.Genre.create({
    name: options.name || rand(),
    active:
      typeof options.active !== 'undefined' && options.active !== null
        ? options.active
        : true,
    createdAt: options.createdAt || new Date(),
    updatedAt: options.updatedAt || new Date(),
  });
}

async function addGenre(options) {
  return await models.Genre.create({
    name: options.name || rand(),
    active:
      typeof options.active !== 'undefined' && options.active !== null
        ? options.active
        : true,
    createdAt: options.createdAt || new Date(),
    updatedAt: options.updatedAt || new Date(),
  });
}

async function addProperties(options) {
  return await models.Property.create({
    name: options.name || rand(),
    active:
      typeof options.active !== 'undefined' && options.active !== null
        ? options.active
        : true,
    createdAt: options.createdAt || new Date(),
    updatedAt: options.updatedAt || new Date(),
  });
}

async function addYoutubeLinks(options) {
  return await models.YoutubeLink.create({
    ownerId: options.ownerId,
    ownerType: options.ownerType,
    link: options.link || `http://${rand()}.${rand()}`,
    userId: options.userId,
    createdAt: options.createdAt || new Date(),
    updatedAt: options.updatedAt || new Date(),
  });
}

async function addBookings(options) {
  return await models.Booking.create({
    fromUserId: options.fromUserId,
    toUserId: options.toUserId,
    requestedType: options.requestedType,
    requestedId: options.requestedId,
    requesterType: options.requesterType,
    requesterId: options.requesterId,
    status: options.status || 'pending',
    bookingDate: options.bookingDate || new Date(),
    createdAt: options.createdAt || new Date(),
    updatedAt: options.updatedAt || new Date(),
  });
}

function rand() {
  return Math.random().toString(36).substring(7);
}

module.exports = create;
