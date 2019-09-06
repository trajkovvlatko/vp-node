const db = require('../config/database');

class PerformerModel {
  static async all() {
    try {
      return await db.any('SELECT * FROM performers WHERE active IS TRUE');
    } catch (e) {
      return {error: e};
    }
  }

  static async find(id) {
    try {
      return await db.one(
        'SELECT * FROM performers WHERE active IS TRUE AND id = $1',
        id,
      );
    } catch (e) {
      return {error: 'Record not found.'};
    }
  }
}

module.exports = PerformerModel;
