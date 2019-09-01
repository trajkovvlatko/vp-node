/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  const columns = {
    genre_id: {type: 'integer', references: 'genres', notNull: true},
    performer_id: {type: 'integer', references: 'performers', notNull: true},
    created_at: {type: 'datetime', notNull: true},
    updated_at: {type: 'datetime', notNull: true},
  };
  pgm.createTable('genres_performers', columns);
};

exports.down = (pgm) => {
  pgm.dropTable('genres_performers');
};
