const express = require('express');
const router = express.Router();
const UserModel = require('../../models/user_model.js');
const VenueModel = require('../../models/venue_model.js');
const ImageModel = require('../../models/image_model.js');
const PropertyModel = require('../../models/property_model.js');
const YoutubeLinkModel = require('../../models/youtube_link_model.js');

/* GET index */
router.get('/', async function(req, res, next) {
  const venues = await VenueModel.allForUser(req.user.data.id);
  res.send(venues);
});

/* GET active */
router.get('/active', async function(req, res, next) {
  const venues = await VenueModel.activeForUser(req.user.data.id);
  res.send(venues);
});

/* GET show */
router.get('/:id', async function(req, res, next) {
  const venue = await VenueModel.findForUser(req.user.data.id, req.params.id);
  res.status(venue.error ? 404 : 200).send(venue);
});

/* PATCH update */
router.patch('/:id', async function(req, res, next) {
  const venue = await VenueModel.updateForUser(req.user.data.id, {
    ...req.params,
    ...req.body,
  });
  res.status(venue.error ? 500 : 200).send(venue);
});

/* POST create */
router.post('/', async function(req, res, next) {
  const venue = await VenueModel.createForUser(req.user.data.id, req.body);
  res.status(venue.error ? 500 : 200).send(venue);
});

/* POST :id/images */
router.post('/:id/images', async function(req, res, next) {
  ImageModel.upload(
    req,
    res,
    async function(newImages) {
      let removeImageIds = req.body.remove_image_ids;
      if (removeImageIds && removeImageIds.length > 0) {
        removeImageIds = removeImageIds.split(',').map(i => parseInt(i));
      }
      const save = async name => {
        return ImageModel.createForUser(req.user.data.id, {
          owner_id: req.params.id,
          owner_type: 'Venue',
          image: name,
          selected: false,
        });
      };
      const promises = newImages.map(name => save(name));
      await ImageModel.deleteForUser(req.user.data.id, removeImageIds);
      const saved = await Promise.all(promises);
      res.send(saved).end();
    },
    function() {
      res.status(500).send({error: 'Upload failed.'});
    }
  );
});

/* PATCH :id/properties */
router.patch('/:id/properties', async function(req, res, next) {
  const venueId = req.params.id;
  const venue = VenueModel.existsForUser(req.user.data.id, venueId);
  if (venue.error) {
    return res.status(404).send(venue);
  }

  // TODO: Run all queries in a single transaction
  const save = async propertyId => {
    return await PropertyModel.saveForVenue(venueId, propertyId);
  };
  await PropertyModel.deleteForVenue(venueId);
  const promises = req.body.property_ids.map(propertyId => save(propertyId));
  const saved = await Promise.all(promises);
  res.status(200).send(saved);
});

/* PATCH :id/youtube_links */
router.patch('/:id/youtube_links', async function(req, res, next) {
  const venueId = req.params.id;
  const venue = VenueModel.existsForUser(req.user.data.id, venueId);
  if (venue.error) {
    return res.status(404).send(venue);
  }

  // TODO: Run all queries in a single transaction
  const save = async link => {
    return await YoutubeLinkModel.createForOwner(
      venueId,
      'Venue',
      link,
      req.user.data.id // not needed, remove later
    );
  };

  const removeIds = req.body.remove_youtube_link_ids;
  if (removeIds && removeIds.length > 0) {
    await YoutubeLinkModel.deleteForOwner(venueId, 'Venue', removeIds);
  }
  const promises = req.body.new_youtube_links.map(link => save(link));
  await Promise.all(promises);
  const all = await YoutubeLinkModel.allForOwner(venueId, 'Venue');
  res.status(200).send(all);
});

module.exports = router;
