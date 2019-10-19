const db = require('../../config/database');

class VenueModel {
  static async all(sorting, limit) {
    try {
      const sql = [`
        SELECT venues.id, name, rating, 'venue' AS type, images.image
        FROM public.venues
        JOIN public.images
          ON images.owner_id = venues.id
          AND images.owner_type = 'Venue'
          AND images.selected IS TRUE
        WHERE active IS TRUE
      `];
      if (sorting === 'latest') {
        sql.push('ORDER BY id DESC');
      }
      if (limit) {
        sql.push(`LIMIT ${limit}`);
      }
      return await db.any(sql.join(' '));
    } catch (e) {
      return {error: e};
    }
  }

  static async find(id) {
    try {
      return await db.one(
        'SELECT * FROM public.venues WHERE active IS TRUE AND id = $1',
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
      return await db.any(`SELECT * FROM public.venues WHERE ${wheres}`, data);
    } catch (e) {
      return {error: e};
    }
  }
}

module.exports = VenueModel;
