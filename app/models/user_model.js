const db = require('../../config/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
      const u = await db.any(
        `SELECT id, name, email, password
        FROM public.users
        WHERE email = $1`,
        [email],
      );
      if (u.length === 0) {
        return {error: 'User not found.'}
      }
      const match = await bcrypt.compare(password, u[0].password);
      if (match) {
        return u[0];
      } else {
        return {error: "Passwords doesn't match."};
      }
    } catch (e) {
      return {error: e};
    }
  }

  static async find(id) {
    try {
      // Return a user object
      const data = await db.one(
        `SELECT id, name, email
        FROM public.users
        WHERE id = $1`,
        parseInt(id),
      );
      return new UserModel(data);
    } catch (e) {
      return {error: e};
    }
  }

  static async findByEmail(email) {
    try {
      // Return a user object
      const data = await db.one(
        `SELECT id, name, email
        FROM public.users
        WHERE email = $1`,
        email,
      );
      if (data) {
        return new UserModel(data);
      } else {
        return null;
      }
    } catch (e) {
      return {error: e};
    }
  }

  static async create(data) {
    try {
      const hash = await bcrypt.hash(data.password, saltRounds);
      const record = await db.one(
        `INSERT INTO public.users
        (name, email, password, active, created_at, updated_at)
        VALUES($1, $2, $3, TRUE, now(), now())
        RETURNING id, name, email`,
        [data.name, data.email, hash]
      );
      return new UserModel(record);
    } catch (e) {
      return {error: e};
    }
  }


  performers() {
    return {
      all: async () => {
        try {
          return await db.any(
            `SELECT *
            FROM public.performers
            WHERE active IS TRUE
            AND user_id = $1`,
            [this.data.id],
          );
        } catch (e) {
          return {error: e};
        }
      },

      find: async id => {
        try {
          return await db.one(
            `SELECT *
            FROM public.performers
            WHERE active IS TRUE
            AND user_id = $1
            AND id = $2
            LIMIT 1`,
            [this.data.id, id],
          );
        } catch (e) {
          return {error: 'Performer not found.'};
        }
      },

      create: async (params = {}) => {
        let values = {};
        let columns = [];
        let keys = [];
        ['name', 'location', 'phone', 'details', 'website', 'active'].forEach(
          column => {
            if (
              typeof params[column] !== 'undefined' &&
              params[column] !== null
            ) {
              columns.push(column);
              keys.push(`\$\{${column}}`);
              values[column] = params[column];
            }
          },
        );

        try {
          return await db.one(
            `INSERT INTO public.performers (
              ${columns.join(', ')}, user_id, created_at, updated_at
            )
            VALUES (
              ${keys}, \$\{userId\}, now(), now()
            )
            RETURNING *`,
            {...values, ...{userId: this.data.id}},
          );
        } catch (e) {
          return {error: 'Error creating a performer.'};
        }
      },

      update: async (params = {}) => {
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
            `UPDATE public.performers
            SET ${columns.join(', ')}, updated_at = now()
            WHERE active IS TRUE
            AND user_id = \$\{userId\}
            AND id = $\{id\}
            RETURNING *`,
            {...values, ...{userId: this.data.id}, ...{id: params.id}},
          );
        } catch (e) {
          return {error: 'Error updating performer.'};
        }
      },
    };
  }

  venues() {
    return {
      all: async () => {
        try {
          return await db.any(
            `SELECT *
            FROM public.venues
            WHERE active IS TRUE
            AND user_id = $1`,
            [this.data.id],
          );
        } catch (e) {
          return {error: e};
        }
      },

      find: async id => {
        try {
          return await db.one(
            `SELECT *
            FROM public.venues
            WHERE active IS TRUE
            AND user_id = $1
            AND id = $2
            LIMIT 1`,
            [this.data.id, id],
          );
        } catch (e) {
          return {error: 'Venue not found.'};
        }
      },

      create: async (params = {}) => {
        let values = {};
        let columns = [];
        let keys = [];
        ['name', 'location', 'phone', 'details', 'website', 'active'].forEach(
          column => {
            if (
              typeof params[column] !== 'undefined' &&
              params[column] !== null
            ) {
              columns.push(column);
              keys.push(`\$\{${column}}`);
              values[column] = params[column];
            }
          },
        );

        try {
          return await db.one(
            `INSERT INTO public.venues (
              ${columns.join(', ')}, user_id, created_at, updated_at
            )
            VALUES (
              ${keys}, \$\{userId\}, now(), now()
            )
            RETURNING *`,
            {...values, ...{userId: this.data.id}},
          );
        } catch (e) {
          return {error: 'Error creating a venue.'};
        }
      },

      update: async (params = {}) => {
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
            {...values, ...{userId: this.data.id}, ...{id: params.id}},
          );
        } catch (e) {
          return {error: 'Error updating venue.'};
        }
      },
    };
  }
}

module.exports = UserModel;
