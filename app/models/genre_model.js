const db = require('../../config/database');

class GenreModel {
  static async all() {
    try {
      return await db.any(`
        SELECT id, name
        FROM public.genres
        WHERE active IS TRUE
        ORDER BY id`);
    } catch (e) {
      return {error: e};
    }
  }

  static async create(params) {
    try {
      return await db.one(`
        INSERT INTO public.genres (name, active, created_at, updated_at)
        VALUES ($1, $2, now(), now())
        RETURNING *`,
        [params.name, params.active],
      );
    } catch (e) {
      return {error: 'Error creating a genre.'};
    }
  }
}

module.exports = GenreModel;
