const db = require('../../config/database');

class VenueModel {
  static async all(sorting, limit) {
    try {
      const sql = [
        `
        SELECT venues.id, name, rating, 'venue' AS type, images.image
        FROM public.venues
        JOIN public.images
          ON images.owner_id = venues.id
          AND images.owner_type = 'Venue'
          AND images.selected IS TRUE
        WHERE active IS TRUE
      `,
      ];
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
        `
        SELECT
          venues.*,
          COALESCE(prop.list, '[]'::json) AS properties_list,
          COALESCE(yt.list, '[]'::json) AS youtube_links_list,
          COALESCE(img.list, '[]'::json) AS images_list,
          COALESCE(booking.list, '[]'::json) AS bookings_list
        FROM public.venues

        JOIN LATERAL (
          SELECT json_agg(
            json_build_object(
              'image'::text, images.image,
              'selected'::text, images.selected
            )
          ) AS list
          FROM public.images
          WHERE images.owner_type = 'Venue'
          AND images.owner_id = $1
        ) img ON true

        JOIN LATERAL (
          SELECT json_agg(
            json_build_object(
              'link'::text, youtube_links.link
            )
          ) AS list
          FROM public.youtube_links
          WHERE youtube_links.owner_type = 'Venue'
          AND youtube_links.owner_id = $1
        ) yt ON true

        JOIN LATERAL (
          SELECT json_agg(
            json_build_object(
              'id'::text, properties.id,
              'name'::text, properties.name
            )
          ) AS list
          FROM public.properties

          JOIN public.properties_venues
            ON properties_venues.venue_id = venues.id
            AND properties_venues.property_id = properties.id

          WHERE properties.id = properties_venues.property_id
          AND properties.active IS TRUE
        ) prop ON true

        JOIN LATERAL (
          SELECT json_agg(
            json_build_object(
              'date'::text, bookings.booking_date,
              'performer_id'::text, performers.id,
              'performer_name'::text, performers.name
            )
          ) AS list
          FROM public.bookings

          JOIN public.performers
            ON bookings.performer_id = performers.id

          WHERE bookings.venue_id = $1
        ) booking ON true

        WHERE active IS TRUE
        AND id = $1
        `,
        id,
      );
    } catch (e) {
      return {error: 'Record not found.'};
    }
  }

  static async search(params) {
    try {
      let selects = ['DISTINCT(public.venues.*)', 'images.image'];
      let wheres = [
        'LOWER(location) = LOWER($/location/) AND venues.active IS TRUE',
      ];
      let data = {location: params.location};
      let joins = [
        `
        JOIN public.images
          ON images.owner_id = venues.id
          AND images.owner_type = 'Venue'
          AND images.selected IS TRUE`,
      ];

      if (params.properties && params.properties.length > 0) {
        joins.push(`
          JOIN public.properties_venues
            ON properties_venues.venue_id = venues.id
            AND properties_venues.property_id IN ($/properties:csv/)
          JOIN public.properties
            ON properties.id = properties_venues.property_id
            AND properties.active IS TRUE`);
        data.properties = params.properties;
      }

      if (params.date) {
        joins.push(`
          LEFT JOIN public.bookings
            ON bookings.venue_id = venues.id
            AND bookings.booking_date = $/booking_date/
        `);
        data.booking_date = params.date;
        wheres.push('bookings.id IS NULL');
      }

      selects = selects.join(', ');
      wheres = wheres.join(' AND ');
      joins = joins.join(' ');

      return await db.any(
        `SELECT ${selects} FROM public.venues ${joins} WHERE ${wheres}`,
        data,
      );
    } catch (e) {
      return {error: e};
    }
  }
}

module.exports = VenueModel;
