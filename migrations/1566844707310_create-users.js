exports.up = (pgm) => {
  const columns = {
    id: {type: 'serial', primaryKey: true},
    name: {type: 'string', notNull: true},
    email: {type: 'string', notNull: true},
    password: {type: 'string', notNull: true},
    active: {type: 'boolean', notNull: true, default: true},
    createdAt: {type: 'datetime', notNull: true},
    updatedAt: {type: 'datetime', notNull: true},
  };
  pgm.createTable('users', columns);
  pgm.createIndex('users', ['email'], {unique: true});
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
