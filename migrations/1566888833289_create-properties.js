exports.up = (pgm) => {
  const columns = {
    id: {type: 'serial', primaryKey: true},
    name: {type: 'string', notNull: true},
    active: {type: 'boolean', notNull: true, default: true},
    createdAt: {type: 'datetime', notNull: true},
    updatedAt: {type: 'datetime', notNull: true},
  };
  pgm.createTable('properties', columns);
  pgm.createIndex('properties', ['name'], {unique: true});
};

exports.down = (pgm) => {
  pgm.dropTable('properties');
};
