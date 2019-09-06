const db = require('../lib/database');

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
        'SELECT id, name, email FROM users WHERE email = $1 AND password = $2',
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
        'SELECT id, name, email FROM users WHERE id = $1',
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
        'SELECT * FROM performers WHERE active = $1 AND user_id = $2',
        [true, this.data.id],
      );
    } catch (e) {
      return {error: e};
    }
  }

  async performer(id) {
    try {
      return await db.one(
        'SELECT * FROM performers WHERE active = $1 AND user_id = $2 AND id = $3 LIMIT 1',
        [true, this.data.id, id],
      );
    } catch (e) {
      return {error: 'Performer not found.'};
    }
  }
}

module.exports = UserModel;
