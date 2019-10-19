const UserModel = require('../app/models/user_model');
const PerformerModel = require('../app/models/performer_model');
const db = require('./database');

const locations = ['Sweden', 'Denmark', 'Norway', 'Finland'];

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function addPerformer(user, i) {
  console.log("addPerformer", i)
  const performer = await user.performers().create({
    name: `Performer ${i}`,
    location: randomElement(locations),
    phone: `${i}${i}${i}${i}${i}`,
    details: `${i} - Lorem Ipsum is simply dummy text of the printing and
      typesetting industry. Lorem Ipsum has been the industry's standard
      dummy text ever since the 1500s, when an unknown printer took a galley
      of type and scrambled`,
    website: `http://website-${i}.asdf`,
    active: true,
  });

  await user.images().create({
    owner_id: performer.id,
    owner_type: 'Performer',
    image: `selected-image-${i}.jpg`,
    selected: true,
  });

  await user.images().create({
    owner_id: performer.id,
    owner_type: 'Performer',
    image: `image-${i}.jpg`,
    selected: false,
  });
  console.log('Done', i);
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
})();
