const express = require('express');
const router = express.Router();
const UserModel = require('../../models/user_model.js');
const ImageModel = require('../../models/image_model.js');
const GenreModel = require('../../models/genre_model.js');
const PerformerModel = require('../../models/performer_model.js');
const YoutubeLinkModel = require('../../models/youtube_link_model.js');

/* GET index */
router.get('/', async function(req, res, next) {
  const performers = await PerformerModel.allForUser(req.user.data.id);
  res.send(performers);
});

/* GET active */
router.get('/active', async function(req, res, next) {
  const performers = await PerformerModel.activeForUser(req.user.data.id);
  res.send(performers);
});

/* GET show */
router.get('/:id', async function(req, res, next) {
  const performer = await PerformerModel.findForUser(
    req.user.data.id,
    req.params.id
  );
  res.status(performer.error ? 404 : 200).send(performer);
});

/* PATCH update */
router.patch('/:id', async function(req, res, next) {
  const performer = await PerformerModel.updateForUser(req.user.data.id, {
    ...req.params,
    ...req.body,
  });
  res.status(performer.error ? 500 : 200).send(performer);
});

/* POST create */
router.post('/', async function(req, res, next) {
  const performer = await PerformerModel.createForUser(
    req.user.data.id,
    req.body
  );
  res.status(performer.error ? 500 : 200).send(performer);
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
          owner_type: 'Performer',
          image: name,
          selected: false,
        });
      };
      // TODO: Run all queries in a single transaction
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

/* PATCH :id/genres */
router.patch('/:id/genres', async function(req, res, next) {
  const performerId = req.params.id;
  const performer = PerformerModel.existsForUser(req.user.data.id, performerId);
  if (performer.error) {
    return res.status(404).send(performer);
  }

  // TODO: Run all queries in a single transaction
  const save = async genreId => {
    return await GenreModel.saveForPerformer(performerId, genreId);
  };
  await GenreModel.deleteForPerformer(performerId);
  const promises = req.body.genre_ids.map(genreId => save(genreId));
  const saved = await Promise.all(promises);
  res.status(200).send(saved);
});

/* PATCH :id/youtube_links */
router.patch('/:id/youtube_links', async function(req, res, next) {
  const performerId = req.params.id;
  const performer = PerformerModel.existsForUser(req.user.data.id, performerId);
  if (performer.error) {
    return res.status(404).send(performer);
  }

  // TODO: Run all queries in a single transaction
  const save = async link => {
    return await YoutubeLinkModel.createForOwner(
      performerId,
      'Performer',
      link,
      req.user.data.id // not needed, remove later
    );
  };

  const removeIds = req.body.remove_youtube_link_ids;
  if (removeIds && removeIds.length > 0) {
    await YoutubeLinkModel.deleteForOwner(performerId, 'Performer', removeIds);
  }
  const promises = req.body.new_youtube_links.map(link => save(link));
  await Promise.all(promises);
  const all = await YoutubeLinkModel.allForOwner(performerId, 'Performer');
  res.status(200).send(all);
});

module.exports = router;
