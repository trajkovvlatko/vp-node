const db = require('../../config/database');
const {sqlGetVenue} = require('./helpers/venue_helper');

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
        `${sqlGetVenue()}
         WHERE active IS TRUE AND id = $1
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

  static async allForUser(userId) {
    try {
      return await db.any(
        `SELECT *
        FROM public.venues
        WHERE active IS TRUE
        AND user_id = $1`,
        [userId],
      );
    } catch (e) {
      return {error: e};
    }
  }

  static async existsForUser(userId, id) {
    try {
      return await db.one(`
        SELECT 1
        FROM venues
        WHERE id = $1 AND user_id = $2`,
        [id, userId],
      );
    } catch (e) {
      return {error: 'Venue not found.'};
    }
  }

  static async findForUser(userId, id) {
    try {
      return await db.one(
        `${sqlGetVenue()}
         WHERE id = $1 AND user_id = $2`,
        [id, userId],
      );
    } catch (e) {
      return {error: 'Venue not found.'};
    }
  }

  static async createForUser(userId, params = {}) {
    let values = {};
    let columns = [];
    let keys = [];
    [
      'name',
      'location',
      'phone',
      'details',
      'website',
      'rating',
      'active',
    ].forEach(column => {
      if (
        typeof params[column] !== 'undefined' &&
        params[column] !== null
      ) {
        columns.push(column);
        keys.push(`\$\{${column}}`);
        values[column] = params[column];
      }
    });

    try {
      return await db.one(
        `INSERT INTO public.venues (
          ${columns.join(', ')}, user_id, created_at, updated_at
        )
        VALUES (
          ${keys}, \$\{userId\}, now(), now()
        )
        RETURNING *`,
        {...values, ...{userId: userId}},
      );
    } catch (e) {
      return {error: 'Error creating a venue.'};
    }
  }

  static async updateForUser(userId, params = {}) {
    let columns = [];
    let values = {};
    ['name', 'location', 'phone', 'details', 'website', 'active'].forEach(
      column => {
        if (
          typeof params[column] !== 'undefined' &&
          params[column] !== null
        ) {
          columns.push(`${column} = \$\{${column}\}`);
          values[column] = params[column];
        }
      },
    );

    try {
      return await db.one(
        `UPDATE public.venues
        SET ${columns.join(', ')}, updated_at = now()
        WHERE active IS TRUE
        AND user_id = \$\{userId\}
        AND id = $\{id\}
        RETURNING *`,
        {...values, ...{userId: userId}, ...{id: params.id}},
      );
    } catch (e) {
      return {error: 'Error updating venue.'};
    }
  }
}

module.exports = VenueModel;
