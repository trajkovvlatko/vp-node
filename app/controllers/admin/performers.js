const express = require('express');
const router = express.Router();
const UserModel = require('../../models/user_model.js');
const path = require('path');
const multer = require('multer');

/* GET index */
router.get('/', async function(req, res, next) {
  const performers = await req.user.performers().all();
  res.send(performers);
});

/* GET show */
router.get('/:id', async function(req, res, next) {
  const performer = await req.user.performers().find(req.params.id);
  res.status(performer.error ? 404 : 200).send(performer);
});

/* PATCH update */
router.patch('/:id', async function(req, res, next) {
  const performer = await req.user
    .performers()
    .update({...req.params, ...req.body});
  if (!performer.error) {
    res.send(performer);
  } else {
    res.status(404).send(performer);
  }
});

/* POST create */
router.post('/', async function(req, res, next) {
  const performer = await req.user.performers().create(req.body);
  if (!performer.error) {
    res.send(performer);
  } else {
    res.status(500).send(performer);
  }
});

/* POST :id/images */
router.post('/:id/images', async function(req, res, next) {
  const FILE_SIZE = 10000000;
  const DESTINATION = './public/uploads/';

  const newImages = [];
  const storage = multer.diskStorage({
    destination: DESTINATION,
    filename: function(req, file, cb) {
      const name = 'IMAGE-' + Math.random() + path.extname(file.originalname);
      newImages.push(name);
      cb(null, name);
    },
  });

  const upload = multer({
    storage: storage,
    limits: {fileSize: FILE_SIZE},
  }).array('images[]');

  upload(req, res, async err => {
    if (!err) {
      let removeImageIds = req.body.remove_image_ids;
      if (removeImageIds && removeImageIds.length > 0) {
        removeImageIds = removeImageIds.split(',').map(i => parseInt(i));
      }

      const save = async name => {
        return req.user.images().create({
          owner_id: req.params.id,
          owner_type: 'Performer',
          image: name,
          selected: false,
        });
      };

      const promises = newImages.map(name => save(name));
      await req.user.images().delete(removeImageIds);
      const saved = await Promise.all(promises);

      return res.send(saved).end();
    } else {
      res.status(500).send({error: 'Upload failed.'});
    }
  });
});

module.exports = router;
