const db = require('../../config/database');
const {sqlGetPerformer} = require('./helpers/performer_helper');

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

  static async basicFind(id) {
    try {
      return await db.one(
        `SELECT *
         FROM performers
         WHERE active IS TRUE
         AND id = $1
        `,
        id,
      );
    } catch (e) {
      return {error: 'Record not found.'};
    }
  }

  static async find(id) {
    try {
      return await db.one(
        `${sqlGetPerformer()}
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
      return {error: e};
    }
  }

  static async allForUser(userId) {
    try {
      return await db.any(
        `SELECT *
        FROM public.performers
        WHERE user_id = $1`,
        [userId],
      );
    } catch (e) {
      return {error: e};
    }
  }

  static async activeForUser(userId) {
    try {
      return await db.any(
        `SELECT *
        FROM public.performers
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
      return await db.one(
        `
        SELECT 1
        FROM performers
        WHERE id = $1 AND user_id = $2`,
        [id, userId],
      );
    } catch (e) {
      return {error: 'Performer not found.'};
    }
  }

  static async findForUser(userId, id) {
    try {
      return await db.one(
        `${sqlGetPerformer()}
         WHERE id = $1 AND user_id = $2`,
        [id, userId],
      );
    } catch (e) {
      return {error: 'Performer not found.'};
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
      if (typeof params[column] !== 'undefined' && params[column] !== null) {
        columns.push(column);
        keys.push(`\$\{${column}}`);
        values[column] = params[column];
      }
    });

    try {
      return await db.one(
        `INSERT INTO public.performers (
          ${columns.join(', ')}, user_id, created_at, updated_at
        )
        VALUES (
          ${keys}, \$\{userId\}, now(), now()
        )
        RETURNING *`,
        {...values, ...{userId: userId}},
      );
    } catch (e) {
      return {error: 'Error creating a performer.'};
    }
  }

  static async updateForUser(userId, params = {}) {
    let columns = [];
    let values = {};
    ['name', 'location', 'phone', 'details', 'website', 'active'].forEach(
      column => {
        if (typeof params[column] !== 'undefined' && params[column] !== null) {
          columns.push(`${column} = \$\{${column}\}`);
          values[column] = params[column];
        }
      },
    );

    try {
      return await db.one(
        `UPDATE public.performers
        SET ${columns.join(', ')}, updated_at = now()
        WHERE active IS TRUE
        AND user_id = \$\{userId\}
        AND id = $\{id\}
        RETURNING *`,
        {...values, ...{userId: userId}, ...{id: params.id}},
      );
    } catch (e) {
      return {error: 'Error updating performer.'};
    }
  }
}

module.exports = PerformerModel;
