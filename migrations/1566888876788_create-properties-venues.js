/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  const columns = {
    property_id: {type: 'integer', references: 'properties', notNull: true},
    venue_id: {type: 'integer', references: 'venues', notNull: true},
    created_at: {type: 'datetime', notNull: true},
    updated_at: {type: 'datetime', notNull: true},
  };
  pgm.createTable('properties_venues', columns);
};

exports.down = pgm => {
  pgm.dropTable('properties_venues');
};
