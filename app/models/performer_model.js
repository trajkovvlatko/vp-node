const db = require('../../config/database');

class PerformerModel {
  static async all(sorting, limit) {
    try {
      const sql = [
        `
        SELECT
          performers.id,
          name,
          rating,
          'performer' AS type,
          images.image
        FROM public.performers
        JOIN public.images
          ON images.owner_id = performers.id
          AND images.owner_type = 'Performer'
          AND images.selected IS TRUE
        WHERE active IS TRUE
      `,
      ];
      if (sorting === 'latest') {
        sql.push('ORDER BY performers.id DESC');
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
        `
        SELECT
          performers.*,
          COALESCE(gen.list, '[]'::json) AS genres_list,
          COALESCE(yt.list, '[]'::json) AS youtube_links_list,
          COALESCE(img.list, '[]'::json) AS images_list,
          COALESCE(booking.list, '[]'::json) AS bookings_list
        FROM public.performers

        JOIN LATERAL (
          SELECT json_agg(
            json_build_object(
              'image'::text, images.image,
              'selected'::text, images.selected
            )
          ) AS list
          FROM public.images
          WHERE images.owner_type = 'Performer'
          AND images.owner_id = $1
        ) img ON true

        JOIN LATERAL (
          SELECT json_agg(
            json_build_object(
              'link'::text, youtube_links.link
            )
          ) AS list
          FROM public.youtube_links
          WHERE youtube_links.owner_type = 'Performer'
          AND youtube_links.owner_id = $1
        ) yt ON true

        JOIN LATERAL (
          SELECT json_agg(
            json_build_object(
              'id'::text, genres.id,
              'name'::text, genres.name
            )
          ) AS list
          FROM public.genres

          JOIN public.genres_performers
            ON genres_performers.performer_id = performers.id
            AND genres_performers.genre_id = genres.id

          WHERE genres.id = genres_performers.genre_id
          AND genres.active IS TRUE
        ) gen ON true

        JOIN LATERAL (
          SELECT json_agg(
            json_build_object(
              'date'::text, bookings.booking_date,
              'venue_id'::text, venues.id,
              'venue_name'::text, venues.name
            )
          ) AS list
          FROM public.bookings

          JOIN public.venues
            ON bookings.venue_id = venues.id

          WHERE bookings.performer_id = $1
        ) booking ON true

        WHERE active IS TRUE
        AND id = $1
        `,
        id,
      );
    } catch (e) {
      console.log(e)
      return {error: 'Record not found.'};
    }
  }

  static async search(params) {
    try {
      let selects = ['DISTINCT(public.performers.*)', 'images.image'];
      let wheres = [
        'LOWER(location) = LOWER($/location/) AND performers.active IS TRUE',
      ];
      let data = {location: params.location};
      let joins = [
        `
        JOIN public.images
          ON images.owner_id = performers.id
          AND images.owner_type = 'Performer'
          AND images.selected IS TRUE`,
      ];

      if (params.genres && params.genres.length > 0) {
        joins.push(`
          JOIN public.genres_performers
            ON genres_performers.performer_id = performers.id
            AND genres_performers.genre_id IN ($/genres:csv/)
          JOIN public.genres
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
      console.log(e);
      return {error: e};
    }
  }
}

// SELECT DISTINCT(public.performers.*)
// FROM public.performers
// JOIN public.genres_performers
//   ON genres_performers.performer_id = performers.id
//   AND genres_performers.genre_id IN (${genres})
// JOIN public.genres
//   ON genres.id = genres_performers.genre_id
//   AND genres.active IS TRUE
// WHERE location = ${location}
// AND performers.active IS TRUE

module.exports = PerformerModel;
