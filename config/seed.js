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

async function addBooking(userId, toUserId, performer, venue) {
  await BookingModel.createForUser(userId, {
    toUserId: toUserId,
    requesterType: 'performer',
    requesterId: performer.id,
    requestedType: 'venue',
    requestedId: venue.id,
    bookingDate: randomElement(['2012-01-01', '2012-01-02', '2012-01-03']),
    status: 'requested', //randomElement(['requested', 'agreed', 'completed']),
  });
}

(async function() {
  await db.any('TRUNCATE TABLE public.users CASCADE;');

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

  for (let i = 1; i <= 5; i++) {
    const fromUser = await UserModel.create({
      name: `User name ${i}`,
      email: `user-${i}@name.com`,
      password: 'password',
    });

    const toUser = await UserModel.create({
      name: `Other user ${i}`,
      email: `other-${i}@name.com`,
      password: 'password',
    });

    const performer = await addPerformer(fromUser.data.id, i);
    await addPerformer(fromUser.data.id, i);
    await addVenue(fromUser.data.id, i);

    const venue = await addVenue(toUser.data.id, i);
    await addVenue(toUser.data.id, i);
    await addPerformer(toUser.data.id, i);

    await addBooking(fromUser.data.id, toUser.data.id, performer, venue);
  }
})();
