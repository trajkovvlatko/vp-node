/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  const columns = {
    id: {type: 'serial', primaryKey: true},
    name: {type: 'string', notNull: true},
    active: {type: 'boolean', notNull: true, default: true},
    created_at: {type: 'datetime', notNull: true},
    updated_at: {type: 'datetime', notNull: true},
  };
  pgm.createTable('genres', columns);
  pgm.createIndex('genres', ['name'], {unique: true});
};

exports.down = pgm => {
  pgm.dropTable('genres')
};
