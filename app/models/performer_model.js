const db = require('../../config/database');

class PerformerModel {
  static async all() {
    try {
      return await db.any(
        'SELECT * FROM public.performers WHERE active IS TRUE',
      );
    } catch (e) {
      return {error: e};
    }
  }

  static async find(id) {
    try {
      return await db.one(
        'SELECT * FROM public.performers WHERE active IS TRUE AND id = $1',
        id,
      );
    } catch (e) {
      return {error: 'Record not found.'};
    }
  }

  static async search(params) {
    try {
      let wheres = ['location = ${location}'];
      let data = {location: params.location};
      wheres = wheres.join(' AND ');
      return await db.any(
        `SELECT * FROM public.performers WHERE ${wheres}`,
        data,
      );
    } catch (e) {
      return {error: e};
    }
  }
}

module.exports = PerformerModel;
