const db = require('./database');
const models = require('../app/models');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const locations = ['Sweden', 'Denmark', 'Norway', 'Finland'];

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rand() {
  return Math.round(Math.random() * 1000000);
}

async function addPerformer(user) {
  const i = rand();
  const performer = await user.createPerformer({
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

  await user.createImage({
    ownerId: performer.id,
    ownerType: 'Performer',
    image: `performers/${performer.id}/selected-image-${i}.jpg`,
    selected: true,
  });

  await user.createImage({
    ownerId: performer.id,
    ownerType: 'Performer',
    image: `performers/${performer.id}/image-${i}.jpg`,
    selected: false,
  });

  const genres = await models.Genre.findAll();
  await db.query(`
    INSERT INTO public.genres_performers
    ("genreId", "performerId", "createdAt", "updatedAt")
    VALUES (${randomElement(genres).id}, ${performer.id}, now(), now())`);
  await db.query(`
    INSERT INTO public.genres_performers
    ("genreId", "performerId", "createdAt", "updatedAt")
    VALUES (${randomElement(genres).id}, ${performer.id}, now(), now())`);

  await user.createYoutubeLink({
    ownerId: performer.id,
    ownerType: 'Performer',
    link: `http://performer-${performer.id}-youtube-1.asdf`,
  });
  await user.createYoutubeLink({
    ownerId: performer.id,
    ownerType: 'Performer',
    link: `http://performer-${performer.id}-youtube-2.asdf`,
  });
  return performer;
}

async function addVenue(user) {
  const i = rand();
  const venue = await user.createVenue({
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

  await user.createImage({
    ownerId: venue.id,
    ownerType: 'Venue',
    image: `venues/${venue.id}/selected-image-${i}.jpg`,
    selected: true,
  });

  await user.createImage({
    ownerId: venue.id,
    ownerType: 'Venue',
    image: `venues/${venue.id}/image-${i}.jpg`,
    selected: false,
  });

  const properties = await models.Property.findAll();
  await db.query(`
    INSERT INTO public.properties_venues
    ("propertyId", "venueId", "createdAt", "updatedAt")
    VALUES (${randomElement(properties).id}, ${venue.id}, now(), now())`);
  await db.query(`
    INSERT INTO public.properties_venues
    ("propertyId", "venueId", "createdAt", "updatedAt")
    VALUES (${randomElement(properties).id}, ${venue.id}, now(), now())`);

  await user.createYoutubeLink({
    ownerId: venue.id,
    ownerType: 'Venue',
    link: `http://venue-${venue.id}-youtube-1.asdf`,
  });
  await user.createYoutubeLink({
    ownerId: venue.id,
    ownerType: 'Venue',
    link: `http://venue-${venue.id}-youtube-2.asdf`,
  });
  return venue;
}

async function addBooking(fromUser, toUser, performer, venue) {
  await models.Booking.create({
    fromUserId: fromUser.id,
    toUserId: toUser.id,
    requesterType: 'Performer',
    requesterId: performer.id,
    requestedType: 'Venue',
    requestedId: venue.id,
    bookingDate: randomElement(['2012-01-01', '2012-01-02', '2012-01-03']),
    status: 'requested', //randomElement(['requested', 'agreed', 'completed']),
  });
}

(async function () {
  await db.query('TRUNCATE TABLE public.users CASCADE;');

  await db.query('TRUNCATE TABLE public.genres CASCADE;');
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
    await models.Genre.create({name: genres[i], active: true});
  }

  await db.query('TRUNCATE TABLE public.properties CASCADE;');
  const properties = [
    'bar',
    'nightclub',
    'cozy',
    'loud',
    'dance floor',
    'dark',
  ];
  for (let i = 0; i < properties.length; i++) {
    await models.Property.create({name: properties[i], active: true});
  }

  for (let i = 1; i <= 5; i++) {
    const fromUserHash = await bcrypt.hash('password', saltRounds);
    const fromUser = models.User.build({
      name: `User name ${i}`,
      email: `user-${i}@name.com`,
      password: fromUserHash,
    });
    await fromUser.save();

    const toUserHash = await bcrypt.hash('password', saltRounds);
    const toUser = await models.User.build({
      name: `Other user ${i}`,
      email: `other-${i}@name.com`,
      password: toUserHash,
    });
    await toUser.save();

    const performer = await addPerformer(fromUser);
    await addPerformer(fromUser);
    await addVenue(fromUser);

    const venue = await addVenue(toUser);
    await addVenue(toUser);
    await addPerformer(toUser);

    await addBooking(fromUser, toUser, performer, venue);
  }
})();
