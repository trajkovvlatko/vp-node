/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  const columns = {
    id: { type: 'serial', primaryKey: true },
    user_id: {type: 'integer', references: 'users', notNull: true},
    name: {type: 'string', notNull: true},
    location: {type: 'string', notNull: true},
    phone: {type: 'string', notNull: true},
    details: {type: 'text'},
    website: {type: 'string'},
    rating: {type: 'integer'},
    active: {type: 'boolean', notNull: true, default: true},
    created_at: {type: 'datetime', notNull: true},
    updated_at: {type: 'datetime', notNull: true},
  };
  pgm.createTable('performers', columns)
};

exports.down = (pgm) => {
  pgm.dropTable('performers')
};
