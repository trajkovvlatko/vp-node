exports.up = (pgm) => {
  const columns = {
    id: {type: 'serial', primaryKey: true},
    fromUserId: {type: 'integer', references: 'users', notNull: true},
    toUserId: {type: 'integer', references: 'users', notNull: true},
    requesterType: {type: 'string', notNull: true},
    requesterId: {type: 'integer', notNull: true},
    requestedType: {type: 'string', notNull: true},
    requestedId: {type: 'integer', notNull: true},
    status: {type: 'string', notNull: true},
    bookingDate: {type: 'date', notNull: true},
    createdAt: {type: 'datetime', notNull: true},
    updatedAt: {type: 'datetime', notNull: true},
  };
  pgm.createTable('bookings', columns);
};

exports.down = (pgm) => {
  pgm.dropTable('bookings');
};
