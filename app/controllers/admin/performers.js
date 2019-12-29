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

  const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
      cb(null, 'IMAGE-' +Math.random() + path.extname(file.originalname));
    },
  });

  const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
  }).any(); //.array('images[]');

  upload(req, res, err => {
    if (!err) {
      let removeImageIds = req.body.remove_image_ids;
      if (removeImageIds && removeImageIds.length > 0) {
        removeImageIds = removeImageIds.split(',').map((i) => parseInt(i));
        console.log('--------------------');
        console.log(removeImageIds);
        console.log('--------------------');
      }
      return res.send(200).end();
    }
  });

  // const performer = await req.user.performers().find(req.params.id);
  // res.status(performer.error ? 404 : 200).send(performer);
});

module.exports = router;
