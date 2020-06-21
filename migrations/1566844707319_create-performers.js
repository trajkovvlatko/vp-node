exports.up = (pgm) => {
  const columns = {
    id: {type: 'serial', primaryKey: true},
    userId: {type: 'integer', references: 'users', notNull: true},
    name: {type: 'string', notNull: true},
    location: {type: 'string', notNull: true},
    email: {type: 'string', notNull: true},
    phone: {type: 'string', notNull: true},
    details: {type: 'text'},
    website: {type: 'string'},
    rating: {type: 'integer'},
    active: {type: 'boolean', notNull: true, default: true},
    createdAt: {type: 'datetime', notNull: true},
    updatedAt: {type: 'datetime', notNull: true},
  };
  pgm.createTable('performers', columns);
};

exports.down = (pgm) => {
  pgm.dropTable('performers');
};
