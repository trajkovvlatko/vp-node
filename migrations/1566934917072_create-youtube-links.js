/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  const columns = {
    id: {type: 'serial', primaryKey: true},
    userId: {type: 'integer', references: 'users', notNull: true},
    ownerId: {type: 'integer', notNull: true},
    ownerType: {type: 'string', notNull: true},
    link: {type: 'string', notNull: true},
    createdAt: {type: 'datetime', notNull: true},
    updatedAt: {type: 'datetime', notNull: true},
  };
  pgm.createTable('youtube_links', columns);
};

exports.down = (pgm) => {
  pgm.dropTable('youtube_links');
};
