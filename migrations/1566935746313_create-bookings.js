/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  const columns = {
    id: { type: 'serial', primaryKey: true },
    user_id: {type: 'integer', references: 'users', notNull: true},
    venue_id: {type: 'integer', references: 'venues', notNull: true},
    performer_id: {type: 'integer', references: 'performers', notNull: true},
    status: {type: 'string', notNull: true},
    booking_date: {type: 'date', notNull: true},
    created_at: {type: 'datetime', notNull: true},
    updated_at: {type: 'datetime', notNull: true},
  };
  pgm.createTable('bookings', columns)
};

exports.down = (pgm) => {
  pgm.dropTable('bookings')
};
