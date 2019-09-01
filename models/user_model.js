const db = require('../lib/database');

const UserModel = {
  findOne: (email, password) => {
    return db
      .one('SELECT id FROM users WHERE email = $1 AND password = $2', [
        email,
        password,
      ])
      .then(function(data) {
        return data.id;
      })
      .catch(function(err) {
        return err;
      });
  },

  findOneById: id => {
    return db
      .one('SELECT name, email FROM users WHERE id = $1', parseInt(id))
      .then(function(data) {
        return data;
      })
      .catch(function(err) {
        return err;
      });
  },
};

module.exports = UserModel;
