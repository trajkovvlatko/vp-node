/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  const columns = {
    id: { type: 'serial', primaryKey: true },
    user_id: {type: 'integer', references: 'users', notNull: true},
    owner_id: {type: 'integer', notNull: true},
    owner_type: {type: 'integer', notNull: true},
    link: {type: 'string', notNull: true},
    created_at: {type: 'datetime', notNull: true},
    updated_at: {type: 'datetime', notNull: true},
  };
  pgm.createTable('youtube_links', columns)

};

exports.down = (pgm) => {
  pgm.dropTable('youtube_links')
};
