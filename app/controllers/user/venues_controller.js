const express = require('express');
const router = express.Router();
const {Image, Venue} = require('../../models');

/* GET index */
router.get('/', async function (req, res) {
  const venues = await req.user.getVenues({
    attributes: ['id', 'name'],
    order: [['id', 'ASC']],
  });
  res.send(venues);
});

/* GET active */
router.get('/active', async function (req, res) {
  const venues = await req.user.getVenues({
    attributes: ['id', 'name'],
    order: [['id', 'ASC']],
    where: {active: true},
  });
  res.send(venues);
});

/* GET show */
router.get('/:id', async function (req, res) {
  const venue = await getFullVenue(req);
  if (venue) {
    res.send(venue);
  } else {
    res.status(404).send({error: 'Venue not found.'});
  }
});

/* PATCH update */
router.patch('/:id', async function (req, res) {
  const venue = await getOnlyVenue(req);
  if (!venue) {
    res.status(404).send({error: 'Venue not found.'});
    return;
  }
  try {
    await venue.update(
      ({name, location, phone, details, website, active} = req.body),
    );
    res.send(venue);
  } catch (e) {
    console.log(e);
    res.status(500).send({error: 'Cannot update venue.'});
  }
});

/* POST create */
router.post('/', async function (req, res) {
  try {
    const venue = await req.user.createVenue(
      ({name, location, phone, details, website, active} = req.body),
    );
    res.send(venue);
  } catch (e) {
    res.status(500).send({error: 'Error creating a venue.'});
  }
});

/* POST :id/images */
router.post('/:id/images', async function (req, res) {
  const venue = await getOnlyVenue(req);
  if (!venue) {
    return res.status(404).send({error: 'Cannot find venue.'});
  }

  try {
    const newImages = await Image.upload(req, res, `venues/${venue.id}`);
    let removeIds = req.body.remove_image_ids;
    if (removeIds && removeIds.length > 0) {
      removeIds = removeIds.split(',').map((i) => parseInt(i));
    }
    const selectedId = req.body.selected_image_id;
    const all = await venue.updateImages({
      removeIds,
      newImages,
      selectedId,
      userId: req.user.id,
    });
    res.send(
      all.map((i) => {
        return {id: i.id, imageUrl: i.imageUrl, selected: i.selected};
      }),
    );
  } catch (e) {
    res.status(500).send({error: 'An error occured.'});
  }
});

/* PATCH :id/properties */
router.patch('/:id/properties', async function (req, res) {
  const venue = await getOnlyVenue(req);
  if (!venue) {
    return res.status(404).send({error: 'Cannot find venue.'});
  }

  try {
    const propertyIds = req.body.property_ids;
    const all = await venue.updateProperties(propertyIds);
    res.send(
      all.map((p) => {
        return {
          id: p.id,
          name: p.name,
        };
      }),
    );
  } catch (e) {
    res.status(500).send({error: 'An error occured.'});
  }
});

/* PATCH :id/youtube_links */
router.patch('/:id/youtube_links', async function (req, res) {
  const venue = await getOnlyVenue(req);
  if (!venue) {
    return res.status(404).send({error: 'Cannot find venue.'});
  }

  try {
    const removeIds = req.body.remove_youtube_link_ids;
    const newLinks = req.body.new_youtube_links;
    const all = await venue.updateYoutubeLinks({
      removeIds,
      newLinks,
      userId: req.user.id,
    });
    res.send(
      all.map((y) => {
        return {id: y.id, link: y.link};
      }),
    );
  } catch (e) {
    res.status(500).send({error: 'An error occured.'});
  }
});

async function getFullVenue(req) {
  return Venue.find(req.params.id, req.user.id);
}

async function getOnlyVenue(req) {
  return Venue.basicFind(req.params.id, req.user.id);
}

module.exports = router;
