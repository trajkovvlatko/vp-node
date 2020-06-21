exports.up = (pgm) => {
  const columns = {
    propertyId: {type: 'integer', references: 'properties', notNull: true},
    venueId: {type: 'integer', references: 'venues', notNull: true},
    createdAt: {type: 'datetime', notNull: true},
    updatedAt: {type: 'datetime', notNull: true},
  };
  pgm.createTable('properties_venues', columns);
};

exports.down = (pgm) => {
  pgm.dropTable('properties_venues');
};
