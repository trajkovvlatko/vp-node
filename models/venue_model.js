const db = require('../config/database');

class VenueModel {
  static async all() {
    try {
      return await db.any('SELECT * FROM venues WHERE active IS TRUE');
    } catch (e) {
      return {error: e};
    }
  }

  static async find(id) {
    try {
      return await db.one(
        'SELECT * FROM venues WHERE active IS TRUE AND id = $1',
        id,
      );
    } catch (e) {
      return {error: 'Record not found.'};
    }
  }
}

module.exports = VenueModel;
