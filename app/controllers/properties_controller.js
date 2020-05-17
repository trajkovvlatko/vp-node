const express = require('express');
const router = express.Router();
const PropertyModel = require('../models/property_model.js');

/* GET index */
router.get('/', async function (req, res, next) {
  const properties = await PropertyModel.allActive();
  res.send(properties);
});

module.exports = router;
