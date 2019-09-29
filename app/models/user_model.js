const db = require('../../config/database');

class UserModel {
  constructor(data = {}) {
    this.data = data;
  }

  setData(data) {
    this.data = data;
  }

  static async findByCredentials(email, password) {
    try {
      // Must return a plain object to passport
      return await db.one(
        'SELECT id, name, email FROM public.users WHERE email = $1 AND password = $2',
        [email, password],
      );
    } catch (e) {
      return {error: e};
    }
  }

  static async find(id) {
    try {
      // Return a user object
      const data = await db.one(
        'SELECT id, name, email FROM public.users WHERE id = $1',
        parseInt(id),
      );
      return new UserModel(data);
    } catch (e) {
      return {error: e};
    }
  }

  async performers() {
    try {
      return await db.any(
        'SELECT * FROM public.performers WHERE active = $1 AND user_id = $2',
        [true, this.data.id],
      );
    } catch (e) {
      return {error: e};
    }
  }

  async performer(id) {
    try {
      return await db.one(
        'SELECT * FROM public.performers WHERE active = $1 AND user_id = $2 AND id = $3 LIMIT 1',
        [true, this.data.id, id],
      );
    } catch (e) {
      return {error: 'Performer not found.'};
    }
  }

  async venues() {
    try {
      return await db.any(
        'SELECT * FROM public.venues WHERE active = $1 AND user_id = $2',
        [true, this.data.id],
      );
    } catch (e) {
      return {error: e};
    }
  }

  async venue(id) {
    try {
      return await db.one(
        'SELECT * FROM public.venues WHERE active = $1 AND user_id = $2 AND id = $3 LIMIT 1',
        [true, this.data.id, id],
      );
    } catch (e) {
      return {error: 'Venue not found.'};
    }
  }

  async updateVenue(params = {}) {
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
        `UPDATE public.venues
        SET ${columns.join(', ')}, updated_at = now()
        WHERE active IS TRUE
        AND user_id = \$\{userId\}
        AND id = $\{id\}
        RETURNING *`,
        {...values, ...{userId: this.data.id}, ...{id: params.id}},
      );
    } catch (e) {
      return {error: 'Error updating venue.'};
    }
  }
}

module.exports = UserModel;
