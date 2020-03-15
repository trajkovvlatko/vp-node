const UserModel = require('../app/models/user_model');
const GenreModel = require('../app/models/genre_model');
const PropertyModel = require('../app/models/property_model');
const PerformerModel = require('../app/models/performer_model');
const VenueModel = require('../app/models/venue_model');
const YoutubeLinkModel = require('../app/models/youtube_link_model');
const BookingModel = require('../app/models/booking_model');
const ImageModel = require('../app/models/image_model');
const db = require('./database');

const locations = ['Sweden', 'Denmark', 'Norway', 'Finland'];

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function addPerformer(userId, i) {
  const performer = await PerformerModel.createForUser(userId, {
    name: `Performer ${i}`,
    location: randomElement(locations),
    phone: `${i}${i}${i}${i}${i}`,
    details: `${i} - Lorem Ipsum is simply dummy text of the printing and
      typesetting industry. Lorem Ipsum has been the industry's standard
      dummy text ever since the 1500s, when an unknown printer took a galley
      of type and scrambled`,
    website: `http://website-${i}.asdf`,
    rating: randomElement([1, 2, 3, 4, 5]),
    active: true,
  });

  await ImageModel.createForUser(userId, {
    owner_id: performer.id,
    owner_type: 'Performer',
    image: `performers/${performer.id}/selected-image-${i}.jpg`,
    selected: true,
  });

  await ImageModel.createForUser(userId, {
    owner_id: performer.id,
    owner_type: 'Performer',
    image: `performers/${performer.id}/image-${i}.jpg`,
    selected: false,
  });

  const genres = await GenreModel.all();
  await db.any(`
    INSERT INTO public.genres_performers
    (genre_id, performer_id, created_at, updated_at)
    VALUES (${randomElement(genres).id}, ${performer.id}, now(), now())`);
  await db.any(`
    INSERT INTO public.genres_performers
    (genre_id, performer_id, created_at, updated_at)
    VALUES (${randomElement(genres).id}, ${performer.id}, now(), now())`);

  await YoutubeLinkModel.createForOwner(
    performer.id,
    'Performer',
    `http://performer-${performer.id}-youtube-1.asdf`,
    userId,
  );
  await YoutubeLinkModel.createForOwner(
    performer.id,
    'Performer',
    `http://performer-${performer.id}-youtube-2.asdf`,
    userId,
  );
  return performer;
}

async function addVenue(userId, i) {
  const venue = await VenueModel.createForUser(userId, {
    name: `Venue ${i}`,
    location: randomElement(locations),
    phone: `${i}${i}${i}${i}${i}`,
    details: `${i} - Lorem Ipsum is simply dummy text of the printing and
      typesetting industry. Lorem Ipsum has been the industry's standard
      dummy text ever since the 1500s, when an unknown printer took a galley
      of type and scrambled`,
    website: `http://website-${i}.asdf`,
    rating: randomElement([1, 2, 3, 4, 5]),
    active: true,
  });

  await ImageModel.createForUser(userId, {
    owner_id: venue.id,
    owner_type: 'Venue',
    image: `venues/${venue.id}/selected-image-${i}.jpg`,
    selected: true,
  });

  await ImageModel.createForUser(userId, {
    owner_id: venue.id,
    owner_type: 'Venue',
    image: `venues/${venue.id}/image-${i}.jpg`,
    selected: false,
  });

  const properties = await PropertyModel.all();
  await db.any(`
    INSERT INTO public.properties_venues
    (property_id, venue_id, created_at, updated_at)
    VALUES (${randomElement(properties).id}, ${venue.id}, now(), now())`);
  await db.any(`
    INSERT INTO public.properties_venues
    (property_id, venue_id, created_at, updated_at)
    VALUES (${randomElement(properties).id}, ${venue.id}, now(), now())`);

  await YoutubeLinkModel.createForOwner(
    venue.id,
    'Venue',
    `http://venue-${venue.id}-youtube-1.asdf`,
    userId,
  );
  await YoutubeLinkModel.createForOwner(
    venue.id,
    'Venue',
    `http://venue-${venue.id}-youtube-2.asdf`,
    userId,
  );
  return venue;
}

async function addBooking(userId, performer, venue) {
  const booking = await BookingModel.createForUser(userId, {
    performer_id: performer.id,
    venue_id: venue.id,
    booking_date: randomElement(['2012-01-01', '2012-01-02', '2012-01-03']),
    status: randomElement(['requested', 'agreed', 'completed']),
  });
}

(async function() {
  await db.any('TRUNCATE TABLE public.users CASCADE;');

  const user = await UserModel.create({
    name: 'User name',
    email: 'user@name.com',
    password: 'password',
  });

  await db.any('TRUNCATE TABLE public.genres CASCADE;');
  const genres = [
    'Blues',
    'Classical',
    'Country',
    'Electronic',
    'Folk',
    'Jazz',
    'New age',
    'Reggae',
    'Rock',
  ];
  for (let i = 0; i < genres.length; i++) {
    await GenreModel.create({name: genres[i], active: true});
  }

  await db.any('TRUNCATE TABLE public.properties CASCADE;');
  const properties = [
    'bar',
    'nightclub',
    'cozy',
    'loud',
    'dance floor',
    'dark',
  ];
  for (let i = 0; i < properties.length; i++) {
    await PropertyModel.create({name: properties[i], active: true});
  }

  let performer, venue;

  for (let i = 1; i <= 10; i++) {
    performer = await addPerformer(user.data.id, i);
    venue = await addVenue(user.data.id, i);
    await addBooking(user, performer, venue);
  }
})();
