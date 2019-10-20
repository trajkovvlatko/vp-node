const db = require('../../config/database');

class PropertyModel {
  static async all() {
    try {
      return await db.any(`
        SELECT id, name
        FROM public.properties
        WHERE active IS TRUE
        ORDER BY id`);
    } catch (e) {
      return {error: e};
    }
  }

  static async create(params) {
    try {
      return await db.one(`
        INSERT INTO public.properties (name, active, created_at, updated_at)
        VALUES ($1, $2, now(), now())
        RETURNING *`,
        [params.name, params.active],
      );
    } catch (e) {
      return {error: 'Error creating a property.'};
    }
  }
}

module.exports = PropertyModel;
