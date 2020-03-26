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
      return await db.one(
        `
        INSERT INTO public.genres (name, active, created_at, updated_at)
        VALUES ($1, $2, now(), now())
        RETURNING *`,
        [params.name, params.active],
      );
    } catch (e) {
      return {error: 'Error creating a genre.'};
    }
  }

  static async saveForPerformer(performerId, genreId) {
    try {
      return await db.one(
        `
        INSERT INTO public.genres_performers
          (genre_id, performer_id, created_at, updated_at)
        VALUES ($1, $2, now(), now())
        RETURNING *`,
        [genreId, performerId],
      );
    } catch (e) {
      return {error: 'Error saving genre to performer.'};
    }
  }

  static async deleteForPerformer(performerId) {
    try {
      return await db.none(
        `
        DELETE FROM public.genres_performers
        WHERE performer_id = $1`,
        [performerId],
      );
    } catch (e) {
      return {error: 'Error deleting genres from performer.'};
    }
  }
}

module.exports = GenreModel;
