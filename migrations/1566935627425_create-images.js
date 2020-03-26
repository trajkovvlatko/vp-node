/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  const columns = {
    id: {type: 'serial', primaryKey: true},
    user_id: {type: 'integer', references: 'users', notNull: true},
    owner_id: {type: 'integer', notNull: true},
    owner_type: {type: 'string', notNull: true},
    image: {type: 'string', notNull: true},
    selected: {type: 'boolean', notNull: true, default: false},
    created_at: {type: 'datetime', notNull: true},
    updated_at: {type: 'datetime', notNull: true},
  };
  pgm.createTable('images', columns);
};

exports.down = pgm => {
  pgm.dropTable('images');
};
