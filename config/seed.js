const UserModel = require('../app/models/user_model');
const PerformerModel = require('../app/models/performer_model');
const db = require('./database');

const locations = ['Sweden', 'Denmark', 'Norway', 'Finland'];

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function addPerformer(user, i) {
  const performer = await user.performers().create({
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

  await user.images().create({
    owner_id: performer.id,
    owner_type: 'Performer',
    image: `performers/${performer.id}/selected-image-${i}.jpg`,
    selected: true,
  });

  await user.images().create({
    owner_id: performer.id,
    owner_type: 'Performer',
    image: `performers/${performer.id}/image-${i}.jpg`,
    selected: false,
  });
}

async function addVenue(user, i) {
  const venue = await user.venues().create({
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

  await user.images().create({
    owner_id: venue.id,
    owner_type: 'Venue',
    image: `venues/${venue.id}/selected-image-${i}.jpg`,
    selected: true,
  });

  await user.images().create({
    owner_id: venue.id,
    owner_type: 'Venue',
    image: `venues/${venue.id}/image-${i}.jpg`,
    selected: false,
  });
}

(async function() {
  await db.any('TRUNCATE TABLE public.users CASCADE;');

  const user = await UserModel.create({
    name: 'User name',
    email: 'user@name.com',
    password: 'password',
  });

  for (let i = 1; i <= 10; i++) {
    await addPerformer(user, i);
  }

  for (let i = 1; i <= 10; i++) {
    await addVenue(user, i);
  }
})();