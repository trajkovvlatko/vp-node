const express = require('express');
const router = express.Router();
const sequelize = require('../../config/database');

async function connect() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

router.get('/', async function (_, res) {
  try {
    await connect();
    res.send({success: true});
  } catch (_) {
    res.status(500).send({error: 'Cannot select from database.'});
  }
});

module.exports = router;
