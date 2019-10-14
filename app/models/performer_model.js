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
      let selects = ['DISTINCT(public.performers.*)'];
      let wheres = ['location = $/location/ AND performers.active IS TRUE'];
      let data = {location: params.location};
      let joins = [];

      if (params.genres && params.genres.length > 0) {
        joins.push(`
          INNER JOIN public.genres_performers
            ON genres_performers.performer_id = performers.id
            AND genres_performers.genre_id IN ($/genres:csv/)
          INNER JOIN public.genres
            ON genres.id = genres_performers.genre_id
            AND genres.active IS TRUE`);
        data.genres = params.genres;
      }

      if (params.date) {
        joins.push(`
          LEFT JOIN public.bookings
            ON bookings.performer_id = performers.id
            AND bookings.booking_date = $/booking_date/
        `);
        data.booking_date = params.date;
        wheres.push('bookings.id IS NULL');
      }

      selects = selects.join(', ');
      wheres = wheres.join(' AND ');
      joins = joins.join(' ');

      return await db.any(
        `SELECT ${selects} FROM public.performers ${joins} WHERE ${wheres}`,
        data,
      );
    } catch (e) {
      return {error: e};
    }
  }
}

// SELECT DISTINCT(public.performers.*)
// FROM public.performers
// INNER JOIN public.genres_performers
//   ON genres_performers.performer_id = performers.id
//   AND genres_performers.genre_id IN (${genres})
// INNER JOIN public.genres
//   ON genres.id = genres_performers.genre_id
//   AND genres.active IS TRUE
// WHERE location = ${location}
// AND performers.active IS TRUE

module.exports = PerformerModel;
