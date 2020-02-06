const db = require('../../config/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {sqlGetPerformer} = require('./helpers/performer_helper');
const {sqlGetVenue} = require('./helpers/venue_helper');

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
        return {error: 'User not found.'};
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
        [data.name, data.email, hash],
      );
      return new UserModel(record);
    } catch (e) {
      return {error: e};
    }
  }
}

module.exports = UserModel;
