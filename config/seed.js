const db = require('./database');
const models = require('../app/models');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const locations = ['Sweden', 'Denmark', 'Norway', 'Finland'];
const phones = [
  '070 441 45 62',
  '071 442 55 63',
  '072 443 65 64',
  '073 444 75 65',
  '070 445 85 66',
  '071 446 95 67',
  '072 447 15 68',
  '073 448 25 69',
  '070 449 35 61',
  '071 414 41 62',
  '072 424 52 63',
  '073 434 63 64',
  '070 444 74 65',
];

const performerNames = [
  'Scrummy September',
  'Tower Metal',
  'Maggieatron',
  'Megatower',
  'E.N.T.E.R.T.A.I.N.I.N.G.',
  'Panic',
  'Head',
  'The Bouncing Bananas',
  'Saving Maggie',
  'One Zilliondust',
  'Maggie and the Singers',
  'One Zillion Seconds',
  'Bouncing Twins',
  'Wild Bouncing Rabbits',
  'The Bouncing Arm Pits',
  'Rubbish Rabbits',
  'Entertaining Tooth',
  'The Strippers',
  'Bathtub Bouncing',
  'Thunder Arm',
  'Deaf Rabbits',
  'Disciples Of Venus',
  'Entertaining Entertaining Entertaining',
  'The Sisters',
  'Maggie and the Scrummy Humans',
  'Beyond Prague',
  'Twilight of the Gods',
  'Tribute Towel',
  'Scrummy Bananas',
  'Entertaining Bananas of the Blue Towel',
];

const venueNames = [
  'The Freezing Twig Bar',
  'Cafe Max',
  'Shoppers Cafe',
  'Ye Olde Tortoise',
  'The Itchy Baboon Bar',
  'The Wicked Rhinoceros Inn',
  'The Attractive Dagger Tavern',
  'The Cheap Cup',
  'Bed And Breakfast Travel',
  'Tabu Nightclub',
  'Laugh In Comedy Cafe',
  'Some Place Else',
  'Midnight Blues',
  'Wharf',
  "Charlie's",
  'W. H. Frank Wine & Liquor; LTD',
  'Bernie',
  'New Fortune',
  'The Japanese Bar',
  'The Bitter Helmet Inn',
  'The Nostalgic Dwarf',
  'Savannahmenu.com',
  'Green Tea Kitchen',
  'Cafe Maxx',
  'Shoppers Cafe',
  'Invite American Kitchen & Bar',
  'Chillingsworth',
  'Seasons Pizza',
  'Mallorca',
  'The Pizza Place',
  'LA Cuisine Catering',
  'Province Breads & Cafe',
];

const youtubeLinks = [
  'https://www.youtube.com/watch?v=q0hyYWKXF0Q',
  'https://www.youtube.com/watch?v=EgBJmlPo8Xw',
  'https://www.youtube.com/watch?v=UPOT2tgY9QQ',
  'https://www.youtube.com/watch?v=4NRXx6U8ABQ',
  'https://www.youtube.com/watch?v=JR49dyo-y0E',
  'https://www.youtube.com/watch?v=cBVGlBWQzuc',
  'https://www.youtube.com/watch?v=PmYypVozQb4',
  'https://www.youtube.com/watch?v=jzD_yyEcp0M',
  'https://www.youtube.com/watch?v=SmbmeOgWsqE',
  'https://www.youtube.com/watch?v=m7Bc3pLyij0',
  'https://www.youtube.com/watch?v=VF-r5TtlT9w',
  'https://www.youtube.com/watch?v=7wtfhZwyrcc',
  'https://www.youtube.com/watch?v=8EJ3zbKTWQ8',
  'https://www.youtube.com/watch?v=w2Ov5jzm3j8',
];

const addresses = [
  'Norra Bäckebo 42, Timmernabben',
  'Trädgårdsgatan 41, Hudiksvall',
  'Knektvägen 29, Torna-hällestad',
  'Korsgatan 62, StrÖmstad',
  'Figgeberg Gårdeby 42, MÖlnbo',
  'Änggårda Anga 69, Slite',
  'Utveda 27, Björna',
  'Mjölkalånga 41, Höganäs',
  'Hökgatan 59, Vallsta',
  'Hantverkarg 95, Ingarö',
  'Libecksvägen 81, Sköllersta',
  'Lillesäter Kullberg 8, Nattavaaraby',
  'Arveliveien 223, Greåker',
  'Høyanfjellet 17, Skien',
  'Sorgenfrigata 208, Sellebakk',
  'Fjellstua 46, Halden',
  'Bekkeveien 219, Blommenholm',
  'Brandstorpveien 43, Skjeberg',
  'Heggeliveien 50, Blommenholm',
  'Eilif Gulbrandsons veg 219, Heimdal',
  'Nicolaysens vei 222, Bergen',
  'Storgata 65, Mo i rana',
  'Konglevegen 178, Lillehammer',
  'Tømmeråsen 175, Paradis',
  'Eskelundsvej 85, København V',
  'Skolegyden 47, Sjælland',
  'Søndre Havnevej 41, Barrit',
  'Askelund 64, Bogø By',
  'Sønderstræde 73, København V',
  'Odensevej 76, Gadbjerg',
];

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rand() {
  return Math.round(Math.random() * 1000000);
}

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

async function addPerformer(user) {
  const i = rand();
  const performer = await user.createPerformer({
    name: performerNames.pop(),
    location: randomElement(locations),
    phone: randomElement(phones),
    email: `email-${i}@performer.com`,
    details: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled. Lorem Ipsum is simply dummy text of the printing typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled`,
    website: `http://performers-website-${i}.com`,
    rating: randomElement([3, 4, 5]),
    active: true,
  });

  await user.createImage({
    ownerId: performer.id,
    ownerType: 'Performer',
    image: `performers/${performer.id}/1.jpg`,
    selected: true,
  });

  await user.createImage({
    ownerId: performer.id,
    ownerType: 'Performer',
    image: `performers/${performer.id}/2.jpg`,
    selected: false,
  });

  await user.createImage({
    ownerId: performer.id,
    ownerType: 'Performer',
    image: `performers/${performer.id}/3.jpg`,
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
    link: randomElement(youtubeLinks),
  });
  await user.createYoutubeLink({
    ownerId: performer.id,
    ownerType: 'Performer',
    link: randomElement(youtubeLinks),
  });

  return performer;
}

async function addVenue(user) {
  const i = rand();
  const venue = await user.createVenue({
    name: venueNames.pop(),
    location: randomElement(locations),
    phone: randomElement(phones),
    email: `email-${i}@venue.com`,
    address: addresses.pop(),
    details: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled.`,
    website: `http://venue-website-${i}.asdf`,
    rating: randomElement([3, 4, 5]),
    active: true,
  });

  await user.createImage({
    ownerId: venue.id,
    ownerType: 'Venue',
    image: `venues/${venue.id}/1.jpg`,
    selected: true,
  });

  await user.createImage({
    ownerId: venue.id,
    ownerType: 'Venue',
    image: `venues/${venue.id}/2.jpg`,
    selected: false,
  });

  await user.createImage({
    ownerId: venue.id,
    ownerType: 'Venue',
    image: `venues/${venue.id}/3.jpg`,
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
    link: randomElement(youtubeLinks),
  });

  await user.createYoutubeLink({
    ownerId: venue.id,
    ownerType: 'Venue',
    link: randomElement(youtubeLinks),
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
    bookingDate: randomDate(new Date(2019, 06, 1), new Date(2021, 06, 01)),
    status: randomElement(['requested', 'accepted', 'canceled']),
  });
}

(async function () {
  await db.query('TRUNCATE TABLE public.users RESTART IDENTITY CASCADE;');

  await db.query('TRUNCATE TABLE public.genres RESTART IDENTITY CASCADE;');
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

  await db.query('TRUNCATE TABLE public.properties RESTART IDENTITY CASCADE;');
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

  for (let i = 1; i <= 10; i++) {
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
