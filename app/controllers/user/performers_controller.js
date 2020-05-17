const express = require('express');
const router = express.Router();
const {Image, Performer} = require('../../models');

/* GET index */
router.get('/', async function (req, res) {
  const performers = await req.user.getPerformers({
    attributes: ['id', 'name'],
    order: [['id', 'ASC']],
  });
  res.send(performers);
});

/* GET active */
router.get('/active', async function (req, res) {
  const performers = await req.user.getPerformers({
    attributes: ['id', 'name'],
    order: [['id', 'ASC']],
    where: {active: true},
  });
  res.send(performers);
});

/* GET show */
router.get('/:id', async function (req, res) {
  const performer = await getFullPerformer(req);
  if (performer) {
    res.send(performer);
  } else {
    res.status(404).send({error: 'Performer not found.'});
  }
});

/* PATCH update */
router.patch('/:id', async function (req, res) {
  const performer = await getOnlyPerformer(req);
  if (!performer) {
    res.status(404).send({error: 'Performer not found.'});
    return;
  }
  try {
    await performer.update(
      ({name, location, phone, details, website, active} = req.body),
    );
    res.send(performer);
  } catch (e) {
    res.status(500).send({error: 'Cannot update performer.'});
  }
});

/* POST create */
router.post('/', async function (req, res) {
  try {
    const performer = await req.user.createPerformer(
      ({name, location, phone, details, website, active} = req.body),
    );
    res.send(performer);
  } catch (e) {
    res.status(500).send({error: 'Error creating a performer.'});
  }
});

/* POST :id/images */
router.post('/:id/images', async function (req, res) {
  const performer = await getOnlyPerformer(req);
  if (!performer) {
    return res.status(404).send({error: 'Cannot find performer.'});
  }

  try {
    const newImages = await Image.upload(
      req,
      res,
      `performers/${performer.id}`,
    );
    let removeIds = req.body.remove_image_ids;
    if (removeIds && removeIds.length > 0) {
      removeIds = removeIds.split(',').map((i) => parseInt(i));
    }
    const all = await performer.updateImages({
      removeIds,
      newImages,
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

/* PATCH :id/genres */
router.patch('/:id/genres', async function (req, res) {
  const performer = await getOnlyPerformer(req);
  if (!performer) {
    return res.status(404).send({error: 'Cannot find performer.'});
  }

  try {
    const removeIds = req.body.remove_genre_ids;
    const newGenreIds = req.body.genre_ids;
    const all = await performer.updateGenres({removeIds, newGenreIds});
    res.send(
      all.map((g) => {
        return {
          id: g.id,
          name: g.name,
        };
      }),
    );
  } catch (e) {
    res.status(500).send({error: 'An error occured.'});
  }
});

/* PATCH :id/youtube_links */
router.patch('/:id/youtube_links', async function (req, res) {
  const performer = await getOnlyPerformer(req);
  if (!performer) {
    return res.status(404).send({error: 'Cannot find performer.'});
  }

  try {
    const removeIds = req.body.remove_youtube_link_ids;
    const newLinks = req.body.new_youtube_links;
    const all = await performer.updateYoutubeLinks({
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

async function getFullPerformer(req) {
  return Performer.find(req.params.id, req.user.id);
}

async function getOnlyPerformer(req) {
  return Performer.basicFind(req.params.id, req.user.id);
}

module.exports = router;
