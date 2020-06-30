const env = process.env.NODE_ENV || 'development';
const fs = require('fs');

const configFromEnv = () => {
  if (env === 'test') return;
  const host = process.env.POSTGRES_HOST;
  const port = process.env.POSTGRES_PORT;
  const user = process.env.POSTGRES_USER;
  const password = process.env.POSTGRES_PASSWORD;
  const database = process.env.POSTGRES_DB;
  if (host && port && user && password && database) {
    return {
      host,
      port,
      user,
      password,
      database,
    };
  } else {
    return;
  }
};

const configFromJSON = () => {
  const data = fs.readFileSync('./config/default.json');
  const {host, port, user, password, database} = JSON.parse(data).db[env];
  if (host && port && user && password && database) {
    return {
      host,
      port,
      user,
      password,
      database,
    };
  } else {
    return;
  }
};

module.exports = configFromEnv() || configFromJSON();
