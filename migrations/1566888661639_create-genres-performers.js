/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  const columns = {
    genreId: {type: 'integer', references: 'genres', notNull: true},
    performerId: {type: 'integer', references: 'performers', notNull: true},
    createdAt: {type: 'datetime', notNull: true},
    updatedAt: {type: 'datetime', notNull: true},
  };
  pgm.createTable('genres_performers', columns);
};

exports.down = (pgm) => {
  pgm.dropTable('genres_performers');
};
