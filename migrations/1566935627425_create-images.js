exports.up = (pgm) => {
  const columns = {
    id: {type: 'serial', primaryKey: true},
    userId: {type: 'integer', references: 'users', notNull: true},
    ownerId: {type: 'integer', notNull: true},
    ownerType: {type: 'string', notNull: true},
    image: {type: 'string', notNull: true},
    selected: {type: 'boolean', notNull: true, default: false},
    createdAt: {type: 'datetime', notNull: true},
    updatedAt: {type: 'datetime', notNull: true},
  };
  pgm.createTable('images', columns);
};

exports.down = (pgm) => {
  pgm.dropTable('images');
};
