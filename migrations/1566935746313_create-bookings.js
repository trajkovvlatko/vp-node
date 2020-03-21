/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  const columns = {
    id: {type: 'serial', primaryKey: true},
    from_user_id: {type: 'integer', references: 'users', notNull: true},
    to_user_id: {type: 'integer', references: 'users', notNull: true},
    requester_type: {type: 'string', notNull: true},
    requester_id: {type: 'integer', notNull: true},
    requested_type: {type: 'string', notNull: true},
    requested_id: {type: 'integer', notNull: true},
    status: {type: 'string', notNull: true},
    booking_date: {type: 'datetime', notNull: true},
    created_at: {type: 'datetime', notNull: true},
    updated_at: {type: 'datetime', notNull: true},
  };
  pgm.createTable('bookings', columns);
};

exports.down = pgm => {
  pgm.dropTable('bookings');
};
